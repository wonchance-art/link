import { error } from '@sveltejs/kit';
import { planetBySlug } from '$lib/content/planets';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const planet = planetBySlug(params.slug);
	if (!planet) error(404);
	return { planet };
};
