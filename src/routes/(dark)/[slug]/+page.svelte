<script lang="ts">
	import Realm from '$lib/components/Realm.svelte';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();
	const p = $derived(data.planet);
</script>

<Seo title="{p.name} · {p.symbol} — Open Chaence" description={p.poem} />

<Realm title={p.name} theme={p.symbol} poem={p.poem} accent={p.color} />
