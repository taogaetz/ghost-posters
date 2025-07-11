import { fail } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit';
import {getAuthedDirectusClient, createPublicThread} from "$lib/server/directus.ts"


export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const imageFile = formData.get("imageFile") as File | null;
    const directusAccessToken = cookies.get("directus_access_token")
    let response;
    try {
      const client = await getAuthedDirectusClient(directusAccessToken)
      const payload = {
        title,
        type: 'public'
      };
      console.log("[Attempting thread Creation with Payload ➡️] ", payload)
      response = await createPublicThread(client, payload) 
      console.log("[Public Thread Creation Response: ]", response)
      console.log("[THREAD CREATION RESPONSE ID ]", response.id)

      
    } catch (error) {
      console.log("[Error at /post/thread form action]", error)
      return fail(500, {
        error: 'Failed to create thread.',
        detail: error?.message ?? 'Unknown error'
      });
    }
    if (response?.id){
      throw redirect(303, `/v/thread/${response.id}/`)
    }
    redirect(303, '/v/')
  }
};
