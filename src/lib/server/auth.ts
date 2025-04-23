// src/lib/server/auth.ts
import { GHOST_URL } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import type { GhostMember } from '$lib/types/ghost'; // Adjust path

const GHOST_MEMBER_API_PATH = '/members/api/member';

/**
 * Fetches Ghost member data using the provided session cookies.
 * @param cookies - The SvelteKit cookies object from the incoming request.
 * @returns The GhostMember data if authentication is successful, otherwise null.
 */
export async function getGhostMember(cookies: Cookies): Promise<GhostMember | null> {
	const ssrCookie = cookies.get('ghost-members-ssr');
	const sigCookie = cookies.get('ghost-members-ssr.sig');

	// If essential cookies are missing, the user is not logged into Ghost
	if (!ssrCookie || !sigCookie) {
		return null;
	}

	const ghostMemberApiUrl = `${GHOST_URL}${GHOST_MEMBER_API_PATH}`;

	try {
		console.debug(`[Auth] Attempting to fetch Ghost member data from ${ghostMemberApiUrl}`);

		const response = await fetch(ghostMemberApiUrl, {
			method: 'GET',
			headers: {
				// Forward the Ghost session cookies
				'Cookie': `ghost-members-ssr=${ssrCookie}; ghost-members-ssr.sig=${sigCookie}`,
				'Accept': 'application/json',
			},
		});

		if (!response.ok) {
			// Handle common unsuccessful statuses (e.g., 401 Unauthorized, 403 Forbidden)
			// Ghost usually returns these if the cookies are invalid or expired.
			console.warn(`[Auth] Failed to fetch Ghost member data. Status: ${response.status} ${response.statusText}`);
            // You might want to log response.text() for more details in case of errors
			// const errorBody = await response.text();
            // console.error(`[Auth] Ghost API error body: ${errorBody}`);
			return null;
		}

		// Ghost returns member data on success
		const memberData = await response.json() as GhostMember;
		console.debug(`[Auth] Successfully fetched Ghost member data for email: ${memberData.email}`);
		return memberData;

	} catch (error) {
		console.error('[Auth] Error fetching Ghost member data:', error);
		return null;
	}
}
