import { defineQuery } from 'groq';
import { client, withRetry } from '~/lib/sanity-client';

export interface AiArtifactResourceReference {
  id: string;
  type: string;
  title?: string | null;
  slug?: string | null;
}

export interface AiArtifactResource {
  id: string;
  label?: string | null;
  url?: string | null;
  note?: string | null;
  snippet?: string | null;
  reference?: AiArtifactResourceReference | null;
}

export interface AiArtifact {
  id: string;
  type?: string | null;
  sectionKey?: string | null;
  question?: string | null;
  text?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  resources: AiArtifactResource[];
}

interface LessonArtifactsParams {
  lessonId: string;
  userId?: string | null;
}

interface AiArtifactQueryResource {
  _key: string;
  label?: string;
  title?: string;
  url?: string;
  note?: string;
  description?: string;
  snippet?: string;
  resourceType?: string;
  resourceId?: string;
  href?: string;
  resolvedResource?: {
    _id: string;
    _type: string;
    title?: string;
    slug?: { current?: string };
  } | null;
}

interface AiArtifactQueryResult {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  sectionKey?: string;
  type?: string;
  question?: string;
  prompt?: string;
  title?: string;
  summary?: string;
  text?: string;
  response?: string;
  content?: string;
  body?: string;
  createdAt?: string;
  updatedAt?: string;
  resources?: AiArtifactQueryResource[];
}

const lessonArtifactsQuery = defineQuery(`
  *[_type == "aiArtifact" && coalesce(lesson._ref, lesson[0]._ref) == $lessonId &&
    (!defined($userId) || $userId == "" || userId == $userId)]
  | order(coalesce(createdAt, _createdAt) desc) {
    _id,
    _createdAt,
    _updatedAt,
    sectionKey,
    type,
    question,
    prompt,
    title,
    summary,
    text,
    response,
    content,
    body,
    createdAt,
    updatedAt,
    resources[]{
      _key,
      label,
      title,
      url,
      note,
      description,
      snippet,
      resourceType,
      resourceId,
      href,
      "resolvedResource": select(
        defined(resource) => resource->{
          _id,
          _type,
          title,
          "slug": slug.current
        },
        defined(reference) => reference->{
          _id,
          _type,
          title,
          "slug": slug.current
        },
        null
      )
    }
  }
`);

function mapResources(resources: AiArtifactQueryResource[] | undefined): AiArtifactResource[] {
  if (!resources || resources.length === 0) {
    return [];
  }

  return resources.map((resource) => {
    const resolved = resource.resolvedResource;
    const reference: AiArtifactResourceReference | null = resolved
      ? {
          id: resolved._id,
          type: resolved._type,
          title: resolved.title ?? null,
          slug: resolved.slug?.current ?? null,
        }
      : null;

    return {
      id: resource._key,
      label:
        resource.label ??
        resource.title ??
        resolved?.title ??
        resource.resourceType ??
        resource.url ??
        resource.href ??
        null,
      url: resource.url ?? resource.href ?? null,
      note: resource.note ?? resource.description ?? null,
      snippet: resource.snippet ?? null,
      reference,
    } satisfies AiArtifactResource;
  });
}

function mapArtifacts(results: AiArtifactQueryResult[] = []): AiArtifact[] {
  return results.map((artifact) => {
    const question =
      artifact.question ??
      artifact.prompt ??
      artifact.title ??
      artifact.summary ??
      null;

    const text =
      artifact.text ??
      artifact.response ??
      artifact.content ??
      artifact.body ??
      null;

    return {
      id: artifact._id,
      type: artifact.type ?? null,
      sectionKey: artifact.sectionKey ?? null,
      question,
      text,
      createdAt: artifact.createdAt ?? artifact._createdAt,
      updatedAt: artifact.updatedAt ?? artifact._updatedAt,
      resources: mapResources(artifact.resources),
    } satisfies AiArtifact;
  });
}

export async function getLessonArtifacts({
  lessonId,
  userId,
}: LessonArtifactsParams): Promise<AiArtifact[]> {
  if (!lessonId) {
    return [];
  }

  const results = await withRetry(() =>
    client.fetch<AiArtifactQueryResult[]>(lessonArtifactsQuery, {
      lessonId,
      userId: userId ?? undefined,
    })
  );

  return mapArtifacts(results ?? []);
}

export const dataAiAsk = {
  getLessonArtifacts,
};
