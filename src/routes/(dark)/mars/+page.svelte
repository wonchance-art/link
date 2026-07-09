<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import MoonSystem from '$lib/components/MoonSystem.svelte';
	import { shadows } from '$lib/content/shadows';
	import { planetBySlug } from '$lib/content/planets';

	// Thymos의 그림자 — 기개 곁에서 두려움은 가까워지고, 불안은 멀어진다.
	const p = planetBySlug('mars')!;
</script>

<Seo title="{p.name} · {p.symbol} — Open Chaence" description={p.poem} />

<MoonSystem
	eyebrow={p.symbol}
	title={p.name}
	poem={p.poem}
	accent={p.color}
	texture="/mars.webp"
	globeVmin={14}
	moons={shadows}
/>
