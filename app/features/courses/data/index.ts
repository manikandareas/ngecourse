import { defineQuery } from 'groq';
import { client } from '~/lib/sanity-client';

const getCourses = async () => {
  const coursesQuery = defineQuery(`*[_type == "course"]{
    ...,
    "slug": slug.current,
    }`);
  try {
    return await client.fetch(coursesQuery);
  } catch (error) {
    throw new Error(
      `Failed to fetch courses: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const getCourse = async (slug: string) => {
  const courseQuery = defineQuery(
    `*[_type == "course" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    }`
  );
  try {
    return await client.fetch(courseQuery, { slug });
  } catch (error) {
    throw new Error(
      `Failed to fetch course: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const getCourseById = async (id: string) => {
  const courseByIdQuery = defineQuery('*[_type == "course" && _id == $id][0]');
  try {
    return await client.fetch(courseByIdQuery, { id });
  } catch (error) {
    throw new Error(
      `Failed to fetch course by ID: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const getCourseContents = async (slug: string) => {
  const courseContentsQuery = defineQuery(`
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
  try {
    return await client.fetch(courseContentsQuery, { slug });
  } catch (error) {
    throw new Error(
      `Failed to fetch course contents: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const countCourseContents = async (id: string) => {
  const countCourseContentsQuery = defineQuery(`
    count(*[_type == "course" && _id == $id][0].chapters[]->contents[])
  `);

  try {
    const result = await client.fetch(countCourseContentsQuery, { id });
    return result || 0;
  } catch (error) {
    throw new Error(
      `Failed to count course contents: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const getLessonBySlug = async (slug: string) => {
  const lessonQuery = defineQuery(
    `*[_type == "lesson" && slug.current == $slug][0]`
  );
  try {
    return await client.fetch(lessonQuery, { slug });
  } catch (error) {
    throw new Error(
      `Failed to fetch lesson: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const getChapterBySlug = async (slug: string) => {
  const chapterQuery =
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
  try {
    return await client.fetch(chapterQuery, { slug });
  } catch (error) {
    throw new Error(
      `Failed to fetch chapter: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
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
