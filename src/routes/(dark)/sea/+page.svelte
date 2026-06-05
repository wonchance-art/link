<script lang="ts">
	import Realm from '$lib/components/Realm.svelte';

	const fragments = [
		'어떤 문장은 오래 두어야 비로소 자기 빛깔을 낸다.',
		'바다는 깊을수록 고요하다. 안을 들여다보는 일은 늘 조용하다.',
		'사람과 사람 사이, 그 옅은 그늘에서 가장 다정한 말이 자란다.'
	];
</script>

<svelte:head><title>바다 · 나의 안 — Open Chaence</title></svelte:head>

<Realm
	title="바다"
	theme="나의 안"
	poem="내면과 심연. 가라앉은 것들이 오래 머무는 곳."
	accent="#8fb4cc"
>
	<p class="frag-mark">단상</p>
	<div class="fragments">
		{#each fragments as f, i (i)}
			<p class="frag">{f}</p>
		{/each}
	</div>
</Realm>

<style>
	.frag-mark {
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #8fb4cc;
		margin: 0 0 20px;
	}
	.fragments {
		display: flex;
		flex-direction: column;
		gap: 22px;
	}
	.frag {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: clamp(18px, 2.6vw, 23px);
		line-height: 1.55;
		color: #e9ecf2;
		margin: 0;
		padding-left: 16px;
		border-left: 2px solid rgba(143, 180, 204, 0.45);
		max-width: 520px;
	}
</style>
