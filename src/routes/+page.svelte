<script lang="ts">
	import { profile } from '$lib/content/profile';
	import { links } from '$lib/content/links';
	import { now } from '$lib/content/now';
	import { guestbookSeed } from '$lib/content/guestbook';

	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Links from '$lib/components/Links.svelte';
	import Now from '$lib/components/Now.svelte';
	import Guestbook from '$lib/components/Guestbook.svelte';
	import Footer from '$lib/components/Footer.svelte';

	// description은 *...* 강조 마크업을 벗겨낸 본문.
	const description = profile.tag.replace(/\*/g, '');
</script>

<svelte:head>
	<title>{profile.name} · 글방</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="{profile.name} · 글방" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
</svelte:head>

<main class="page">
	<Hero name={profile.name} nameEn={profile.nameEn} tag={profile.tag} />
	<About body={profile.about} />
	<Links items={links} />
	<Now updatedLabel={now.updatedLabel} body={now.body} />
	<Guestbook entries={guestbookSeed} />
	<Footer />
</main>

<style>
	.page {
		max-width: var(--col-width);
		margin: 0 auto;
		padding: 80px 32px 64px;
	}
	@media (max-width: 640px) {
		.page {
			padding: 56px 24px 48px;
		}
	}
</style>
