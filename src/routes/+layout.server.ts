import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { readMe, updateMe } from "@directus/sdk";
import {getAuthedDirectusClient, getPublicThreads} from "../lib/server/directus.ts" 


export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw error(403, 'Forbidden: You must be logged in to access this page.');
	}

	if (!locals.directusAccessToken) {
		console.error("[Dashboard Load] No directus Access Token found, returning null profile");
		return {
			user: {
				email: locals.user.email,
				name: locals.user.name,
				firstname: locals.user.firstname,
				uuid: locals.user.uuid,
				profile: null
			}
		};
	}

	try {
		const client = getAuthedDirectusClient(locals.directusAccessToken);

		const profile = await client.request(readMe());
    const publicThreads = await getPublicThreads(client);

    console.log("[DEBUG] profile -> " , profile)
    console.log("[DEBUG] public threads -> " , publicThreads)

		return {
			user: {
				email: locals.user.email,
				name: locals.user.name,
				firstname: locals.user.firstname,
				uuid: locals.user.uuid,
				profile
			},
      publicThreads
		};
	} catch (error) {
		console.error("[Dashboard Load] Error fetching profile", error);
		return {
			user: {
				email: locals.user.email,
				name: locals.user.name,
				firstname: locals.user.firstname,
				uuid: locals.user.uuid,
				profile: null
			},
      publicThreads: []
		};
	}
};

