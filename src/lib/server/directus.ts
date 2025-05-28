// src/lib/server/directus.ts
import {
	createDirectus,
	rest,
  authentication,
  realtime,
	staticToken,
	readUsers,
	createUser,
	// login and refresh are part of the base client.auth object
} from '@directus/sdk';
import {
	DIRECTUS_URL,
	DIRECTUS_ADMIN_TOKEN,
	// DIRECTUS_STATIC_TOKEN_FOR_PUBLIC_OPERATIONS // Optional: if you need a non-admin static token
} from '$env/static/private';
import type { UserCreationData, DirectusUser, GhostMember } from '$lib/types/directus';

// Type for the Directus SDK client
type SdkClient = ReturnType<typeof createDirectus<any>> & ReturnType<typeof rest>;

/**
 * Gets a Directus SDK client.
 * If an admin token is explicitly requested and configured, it uses that.
 * Otherwise, it returns a basic client (e.g., for auth operations or public reads).
 * @param useAdminToken - If true, tries to use DIRECTUS_ADMIN_TOKEN.
 * @returns Directus SDK client.
 */
export function getDirectusClient(useAdminToken: boolean = false): SdkClient {
	const client = createDirectus<any>(DIRECTUS_URL)
  .with(rest())
  .with(authentication())
  .with(realtime());

	if (useAdminToken) {
		if (!DIRECTUS_ADMIN_TOKEN) {
			console.warn('[Directus] Admin client requested, but DIRECTUS_ADMIN_TOKEN is not configured.');
			// Depending on strictness, you might throw an error here
			// throw new Error('DIRECTUS_ADMIN_TOKEN is not configured.');
		}
		return client.with(staticToken(DIRECTUS_ADMIN_TOKEN || '')); // Fallback to empty if not set, SDK might handle it or fail
	}

	// Optional: If you have a separate static token for general, non-authed operations
	// if (DIRECTUS_STATIC_TOKEN_FOR_PUBLIC_OPERATIONS) {
	//  return client.with(staticToken(DIRECTUS_STATIC_TOKEN_FOR_PUBLIC_OPERATIONS));
	// }
	return client;
}

/**
 * Finds a Directus user by their email address.
 * Requires admin privileges if searching across all users.
 * @param email The email address to search for.
 * @returns The DirectusUser object if found, otherwise null.
 */
export async function findDirectusUserByEmail(email: string): Promise<DirectusUser | null> {
	const client = getDirectusClient(true); // Use admin client for user lookup
	try {
		const users = await client.request(
			readUsers({
				filter: {
					email: { _eq: email }
				},
				limit: 1
			})
		);
		return users && users.length > 0 ? (users[0] as DirectusUser) : null;
	} catch (error: any) {
		console.error(`[Directus] Error finding user by email ${email}:`, error.errors || error);
		return null;
	}
}

/**
 * Creates a new user in Directus with a default password.
 * Requires admin privileges.
 * @param ghostMember The Ghost member data.
 * @param roleId The ID of the role to assign to the new user.
 * @param defaultPassword The default password for the new user.
 * @returns The created DirectusUser object, or null on failure.
 */
export async function createDirectusUserWithDefaultPassword(
	ghostMember: GhostMember,
	roleId: string,
	defaultPassword: string
): Promise<DirectusUser | null> {
	const client = getDirectusClient(true); // Use admin client for user creation

	// Basic name splitting (can be improved based on your data)
	const nameParts = (ghostMember.name || 'New User').split(' ');
	const firstName = nameParts[0];
	const lastName = nameParts.slice(1).join(' ') || firstName; // Use first name if no last name

	const userData: UserCreationData = {
		first_name: firstName,
		last_name: lastName,
		email: ghostMember.email,
		password: defaultPassword,
		role: roleId,
		status: 'active',
		// Optional: Add provider and external_identifier if you want to link to Ghost
		// provider: 'ghost',
		// external_identifier: ghostMember.uuid,
	};

	try {
		console.log(`[Directus] Creating user in Directus for email: ${ghostMember.email} with role ID: ${roleId}`);
		const newUser = await client.request(createUser(userData));
		return newUser as DirectusUser;
	} catch (error: any) {
		console.error(`[Directus] Error creating Directus user for ${ghostMember.email}:`, error.errors || error);
		return null;
	}
}



export async function loginDirectusUser(email: string, password: string) {
	if (!email || !password) {
		throw new Error('Missing email or password for Directus login');
	}

	const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password })
	});

	if (!res.ok) {
		const errorBody = await res.text(); // Not JSON because Directus might throw raw strings
		throw new Error(`Directus login failed: ${res.status} ${res.statusText} - ${errorBody}`);
	}

	const { data } = await res.json();
	return data; // { access_token, refresh_token, expires, etc. }
}


export function getAuthedDirectusClient(accessToken: string) {
	return getDirectusClient().with(staticToken(accessToken));
}

