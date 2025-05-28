import { json } from '@sveltejs/kit';
import { getAuthedDirectusClient } from '$lib/server/directus.ts';
import { readMe, updateUser } from '@directus/sdk';

export async function POST({ request, locals }) {
  const client = getAuthedDirectusClient(locals.directusAccessToken);

  const ghostEmail = locals.user?.email;
  if (!ghostEmail) {
    return json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const body = await request.json();

  try {
    // Look up the Directus user by email
    const directusUser = await client.request(readMe());

    if (!directusUser) {
      return json({ error: 'Directus user not found' }, { status: 404 });
    }


    const updated = await client.request(updateUser(directusUser.id, body));
    
    return json({ success: true, updated });
  } catch (error) {
    console.error('[Profile Update POST] error ->', error);
    return json({ error: 'Update failed' }, { status: 500 });
  }
}
