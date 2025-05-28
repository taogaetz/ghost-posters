// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { getGhostMember } from '$lib/server/auth';
import {
	getDirectusClient,
	findDirectusUserByEmail,
	createDirectusUserWithDefaultPassword,
  loginDirectusUser
} from '$lib/server/directus';
import {
	DIRECTUS_DEFAULT_USER_PASSWORD,
	DIRECTUS_USER_ROLE_ID // The ID of the role for newly created Directus users
} from '$env/static/private'; // Ensure these are in your .env

const DIRECTUS_ACCESS_TOKEN_COOKIE = 'directus_access_token';
const DIRECTUS_REFRESH_TOKEN_COOKIE = 'directus_refresh_token';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = await getGhostMember(event.cookies);

	const clearDirectusAuthCookies = () => {
			event.cookies.delete(DIRECTUS_ACCESS_TOKEN_COOKIE, { path: '/' });
			event.cookies.delete(DIRECTUS_REFRESH_TOKEN_COOKIE, { path: '/' });
			event.locals.directusAccessToken = undefined;
		};

	if (event.locals.user) {
		console.log(`[Hook] Ghost user authenticated: ${event.locals.user.email}`);

		let directusAccessToken = event.cookies.get(DIRECTUS_ACCESS_TOKEN_COOKIE);
		const directusRefreshToken = event.cookies.get(DIRECTUS_REFRESH_TOKEN_COOKIE);

		const setDirectusAuthCookies = (access_token: string, refresh_token: string, expires_in_ms: number) => {
			event.cookies.set(DIRECTUS_ACCESS_TOKEN_COOKIE, access_token, {
				path: '/',
				httpOnly: true,
				secure: event.url.protocol === 'https:', // SvelteKit's check for secure context
				sameSite: 'lax',
				maxAge: Math.floor(expires_in_ms / 1000) // Convert ms to seconds
			});
			event.cookies.set(DIRECTUS_REFRESH_TOKEN_COOKIE, refresh_token, {
				path: '/',
				httpOnly: true,
				secure: event.url.protocol === 'https:',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // Example: 7 days for refresh token
			});
			event.locals.directusAccessToken = access_token;
		};

		const clearDirectusAuthCookies = () => {
			event.cookies.delete(DIRECTUS_ACCESS_TOKEN_COOKIE, { path: '/' });
			event.cookies.delete(DIRECTUS_REFRESH_TOKEN_COOKIE, { path: '/' });
			event.locals.directusAccessToken = undefined;
		};

		// 1. Check existing access token (e.g., by trying a lightweight Directus API call)
		// For simplicity here, we'll rely on refresh if access token seems missing or potentially stale.
		// A robust check would be to call directus.users.me() and catch errors.

		// 2. If no access token, but refresh token exists, try to refresh
		if (!directusAccessToken && directusRefreshToken) {
			console.log('[Hook] No Directus access token, attempting refresh...');
			try {
				const directusAuthClient = getDirectusClient(); // Basic client for auth operations
				const refreshResult = await directusAuthClient.auth.refresh({
					refresh_token: directusRefreshToken,
					// mode: "json" // Default, to get tokens back
				});

				if (refreshResult && refreshResult.access_token && refreshResult.refresh_token) {
					setDirectusAuthCookies(refreshResult.access_token, refreshResult.refresh_token, refreshResult.expires);
					directusAccessToken = refreshResult.access_token; // Update for current request
					console.log('[Hook] Directus token refreshed successfully.');
				} else {
					console.warn('[Hook] Directus token refresh failed. Clearing old tokens.');
					clearDirectusAuthCookies();
				}
			} catch (error) {
				console.error('[Hook] Error refreshing Directus token:', error);
				clearDirectusAuthCookies();
			}
		}

		// 3. If still no access token (e.g. first login, or refresh failed), try to login/create user
		if (!event.locals.directusAccessToken && event.locals.user) {
			const ghostEmail = event.locals.user.email;
			console.log(`[Hook] No active Directus session for ${ghostEmail}. Attempting login/creation.`);
			try {
				let directusUser = await findDirectusUserByEmail(ghostEmail);

				if (!directusUser) {
					if (!DIRECTUS_USER_ROLE_ID || !DIRECTUS_DEFAULT_USER_PASSWORD) {
						console.error('[Hook] Missing DIRECTUS_USER_ROLE_ID or DIRECTUS_DEFAULT_USER_PASSWORD for user creation.');
						throw new Error('Server configuration error for Directus user creation.');
					}
					console.log(`[Hook] Directus user not found for ${ghostEmail}. Creating...`);
					directusUser = await createDirectusUserWithDefaultPassword(
						event.locals.user,
						DIRECTUS_USER_ROLE_ID,
						DIRECTUS_DEFAULT_USER_PASSWORD
					);
					if (!directusUser) {
						throw new Error('Failed to create Directus user.');
					}
					console.log(`[Hook] Directus user created: ${directusUser.id}`);
				} else {
					console.log(`[Hook] Found existing Directus user: ${directusUser.id}`);
					// Optional: Implement logic to update Directus user profile from Ghost data if needed
					// await updateDirectusUser(directusUser.id, { first_name: event.locals.user.name, ... });
				}

				// Now, log in to Directus with the (potentially new) user's credentials
				if (directusUser) {
					console.log(`[Hook] Attempting to log in Directus user: ${ghostEmail}`);
					const directusAuthClient = getDirectusClient(); // Basic client for auth
					const loginResult = await loginDirectusUser(ghostEmail, DIRECTUS_DEFAULT_USER_PASSWORD)

					if (loginResult && loginResult.access_token && loginResult.refresh_token) {
						setDirectusAuthCookies(loginResult.access_token, loginResult.refresh_token, loginResult.expires);
						console.log(`[Hook] Directus login successful for ${ghostEmail}. Tokens set.`);
					} else {
						console.error(`[Hook] Directus login failed for ${ghostEmail}. No tokens returned.`);
						clearDirectusAuthCookies(); // Clear any partial state
					}
				}
			} catch (error) {
				console.error('[Hook] Error during Directus user sync/login:', error);
				clearDirectusAuthCookies();
			}
		} else if (event.locals.directusAccessToken) {
		    console.log(`[Hook] Directus session already active for ${event.locals.user.email}`);
		}

	} else {
		console.log('[Hook] Ghost user is unauthenticated.');
		// If Ghost user is not authenticated, ensure Directus tokens are also cleared
		if (event.cookies.get(DIRECTUS_ACCESS_TOKEN_COOKIE) || event.cookies.get(DIRECTUS_REFRESH_TOKEN_COOKIE)) {
			console.log('[Hook] Clearing Directus tokens due to Ghost user unauthentication.');
			clearDirectusAuthCookies();
		}
	}

	const response = await resolve(event);
	return response;
};
