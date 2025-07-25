import { defineQuery } from 'groq';
import { client } from '~/lib/sanity-client';

const getCourses = async () => {
  const getCoursesQuery = defineQuery(`*[_type == "course"]{
    ...,
    "slug": slug.current,
    }`);
  return await client.fetch(getCoursesQuery);
};

const getCourse = async (slug: string) => {
  const getCourseQuery = defineQuery(
    `*[_type == "course" && slug.current == $slug][0]{
    ...,
    "slug": slug->,
    }`
  );
  return await client.fetch(getCourseQuery, { slug });
};

const getCourseById = async (id: string) => {
  const getCourseByIdQuery = defineQuery(
    '*[_type == "course" && _id == $id][0]'
  );
  return await client.fetch(getCourseByIdQuery, { id });
};

const getCourseContents = async (slug: string) => {
  const getCourseContentsQuery = defineQuery(`
    *[_type == "course" && slug.current == $slug][0]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      price,
      level,
      thumbnail,
      trailer,
      difficulty,
      "chapters": chapters[]->{
        _id,
        _type,
        _createdAt,
        _updatedAt,
        title,
        slug,
        description,
        "contents": contents[]->{
          _id,
          _type,
          _createdAt,
          _updatedAt,
          title,
          slug,
          _type == "lesson" => {
            content
          },
          _type == "quiz" => {
            description,
            questions
          }
        }
      },
      "topics": topics[]->{
        _id,
        _type,
        _createdAt,
        _updatedAt,
        title,
        slug,
        description,
        icon,
        color
      }
    }
  `);
  return await client.fetch(getCourseContentsQuery, { slug });
};

const countCourseContents = async (id: string) => {
  const countQuery = defineQuery(`
    count(*[_type == "course" && _id == $id][0].chapters[]->contents[])
  `);

  const result = await client.fetch(countQuery, { id });
  return result || 0;
};

const getLessonBySlug = async (slug: string) => {
  const getLessonBySlugQuery = defineQuery(
    `*[_type == "lesson" && slug.current == $slug][0]`
  );
  return await client.fetch(getLessonBySlugQuery, { slug });
};

const getChapterBySlug = async (slug: string) => {
  const getChapterBySlugQuery =
    defineQuery(`*[_type == "chapter" && slug.current == $slug][0]{
    ...,
      "contents": contents[]->{
          _id,
          _type,
          _createdAt,
          _updatedAt,
          title,
          slug,
        }
    }`);
  return await client.fetch(getChapterBySlugQuery, { slug });
};

export const dataCourses = {
  many: getCourses,
  one: getCourse,
  withContents: getCourseContents,
  oneById: getCourseById,
  countContents: countCourseContents,
  getLessonBySlug,
  getChapterBySlug,
};
