import { defineQuery } from "groq";
import { client } from "../lib/sanity";

export const getCoursesByIds = async (ids: string[]) => {
	try {
		const coursesByIdsQuery = defineQuery(
			`*[_type == "course" && _id in $ids]`,
		);
		return await client.fetch(coursesByIdsQuery, { ids });
	} catch (error) {
		throw new Error("Failed to fetch courses by IDs");
	}
};
