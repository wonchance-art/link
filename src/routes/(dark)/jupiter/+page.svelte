<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import MoonSystem from '$lib/components/MoonSystem.svelte';
	import { principles } from '$lib/content/principles';
	import { planetBySlug } from '$lib/content/planets';

	// Nomos의 법전 — 1:2:4 라플라스 공명이 궤도를 지배하고, 위성마다 원칙의 서랍.
	const p = planetBySlug('jupiter')!;
</script>

<Seo title="{p.name} · {p.symbol} — Open Chaence" description={p.poem} />

<MoonSystem
	eyebrow={p.symbol}
	title={p.name}
	poem={p.poem}
	accent={p.color}
	texture="/jupiter.webp"
	globeVmin={20}
	moons={principles}
/>
