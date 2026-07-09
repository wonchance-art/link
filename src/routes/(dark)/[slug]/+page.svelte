<script lang="ts">
	import Realm from '$lib/components/Realm.svelte';

	let { data } = $props();
	const p = $derived(data.planet);
</script>

<svelte:head><title>{p.name} · {p.symbol} — Open Chaence</title></svelte:head>

<Realm title={p.name} theme={p.symbol} poem={p.poem} accent={p.color} />
