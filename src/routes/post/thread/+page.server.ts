import { fail } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit';
import {getAuthedDirectusClient, createPublicThread, uploadFile} from "$lib/server/directus.ts"


export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const file = await formData.get("file") as File | null;
    const directusAccessToken = cookies.get("directus_access_token")
    let response;
    let fileId;


    // first we need to upload the file so we can link the image uuid to the thread
    try {
      const client = await getAuthedDirectusClient(directusAccessToken)
      console.log("[UPLOAD][Trying file upload for file: ]", file)
      const response = await uploadFile(client, file); 
      console.log("[RESPONSE FROM UPLOADED FILE: ]", response)
      fileId = await response.id;
    } catch (error) {
      console.log("[Error Uploading File!]", error)
      return fail(405, "error uploading file")
    }
    
  
    try {
      const client = await getAuthedDirectusClient(directusAccessToken)
      const payload = {
        title,
        type: 'public',
        image: fileId,
      };
      console.log("[Attempting thread Creation with Payload ➡️] ", payload)
      response = await createPublicThread(client, payload) 
      console.log("[Public Thread Creation Response: ]", response)
      
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
