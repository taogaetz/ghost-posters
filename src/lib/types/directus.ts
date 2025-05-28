// src/lib/types/directus.ts
export interface DirectusUser {
	id: string;
	first_name?: string;
	last_name?: string;
	email: string;
	role: string | { id: string; name: string }; // Role can be an ID or a nested object
	status: string;
	// Add any other fields you expect from your Directus user schema
}

export interface UserCreationData {
	first_name: string;
	last_name: string;
	email: string;
	password?: string; // Password is required for creation
	role: string;      // Role ID is expected here
	status?: string;
	// provider?: string; // Optional: useful for tracking user origin
	// external_identifier?: string; // Optional: store Ghost user UUID
}

export interface DirectusAuthResponse {
	access_token: string;
	expires: number; // typically in milliseconds
	refresh_token: string;
}

export type { GhostMember } from '$lib/types/ghost';
