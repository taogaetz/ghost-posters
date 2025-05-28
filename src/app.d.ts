// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { GhostMember } from '$lib/types/ghost'; // Adjust path if needed
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
                user: GhostMember | null;
                directusAccessToken?: string;
              }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
