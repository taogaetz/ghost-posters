import {getAuthedDirectusClient, getSingleThread} from "$lib/server/directus.ts" 

export const load: LayoutServerLoad = async ({ locals, params }) => {

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

		const threadId = params.thread_id 
    const thread = await getSingleThread(client, threadId)


    console.log("[DEBUG] thread -> " , thread)
		return {
		  thread,	
		};
	} catch (error) {
		console.error("[Dashboard Load] Error fetching profile", error);
		return {
      thread: {}
		};
	}
};

