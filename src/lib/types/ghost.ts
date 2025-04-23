// src/lib/types/ghost.ts (or similar location)

export interface GhostTier {
	id: string;
	name: string;
	slug: string;
	active: boolean;
	// ... other tier properties if needed
}

export interface GhostMember {
	id: string;
	uuid: string;
	email: string;
	name: string | null;
	firstname: string | null;
	avatar_image: string | null;
	subscribed: boolean;
	paid: boolean;
	created_at: string;
	last_seen_at: string | null;
	email_count: number;
	email_opened_count: number;
	email_open_rate: number | null;
	status: 'free' | 'paid' | 'comped';
	tiers: GhostTier[];
	// Add other fields you might need from the /members/api/member endpoint
}
