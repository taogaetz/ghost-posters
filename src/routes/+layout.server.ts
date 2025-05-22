import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Check if the user is authenticated via the hook
	if (!locals.user) {
		// Option 1: Redirect to a login page or Ghost sign-in
		// You might need to construct the correct Ghost sign-in URL
		// throw redirect(302, '/signin'); // Or redirect to Ghost's signin
		console.warn('[Dashboard Load] Unauthenticated user attempting to access dashboard.');
        // Option 2: Throw a forbidden error
        throw error(403, 'Forbidden: You must be logged in to access this page.');
	}

	// User is authenticated, proceed to load data for the dashboard
	console.log(`[Dashboard Load] Loading data for authenticated user: ${locals.user.email}`);

	// Return data needed for the dashboard page, potentially including user info
	return {
	 user: { // Pass only necessary, non-sensitive data to the client
			email: locals.user.email,
			name: locals.user.name,
      firstname: locals.user.firstname,
      uuid: locals.user.uuid,
		}
		// ... other dashboard data
	};
};
