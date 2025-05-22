// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { getGhostMember } from '$lib/server/auth'; // Adjust path if needed

/**
 * Server hook to handle incoming requests.
 * It attempts to authenticate the user using Ghost session cookies
 * and populates event.locals.user.
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Attempt to get the Ghost member data based on cookies in the request
	event.locals.user = await getGhostMember(event.cookies);

	// Log authentication status (optional, good for debugging)
	if (event.locals.user) {
		console.log(`[Hook] Request authenticated for user: ${event.locals.user.email}`);
	} else {
		console.log('[Hook] Request is unauthenticated.');
	}
  

  // here we need to upsert the user to directus and make sure the user can modify their profile and make posts.
  // they should have a deterministic pseudonymous handle assigned to them with the option to change it at will.

	// Continue processing the request
	const response = await resolve(event);

	// You could add headers or modify the response here if needed based on auth status

	return response;
};
