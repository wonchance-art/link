<script lang="ts">
	import Realm from '$lib/components/Realm.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { inflows } from '$lib/content/inflows';

	// 바다 = 흘러들어온 것. 우주(내면)에서 유일하게 내가 쓰지 않은 문장들이 고이는 곳.
</script>

<Seo
	title="바다 · 흘러든 것 — Open Chaence"
	description="모든 강이 여기서 끝난다. 흘러든 문장들이 고여 바다가 된다."
/>

<Realm
	title="바다"
	theme="흘러든 것"
	poem="모든 강이 여기서 끝난다. 흘러든 문장들이 고여 바다가 된다."
	accent="#8fb4cc"
>
	{#if inflows.length}
		<p class="frag-mark">흘러든 문장</p>
		<div class="fragments">
			{#each inflows as f, i (i)}
				<blockquote class="frag">
					<p class="fx">{f.text}</p>
					{#if f.source || f.date}
						<cite>{[f.source, f.date].filter(Boolean).join(' · ')}</cite>
					{/if}
				</blockquote>
			{/each}
		</div>
	{:else}
		<p class="empty">아직 흘러든 문장이 없다. 바다는 기다리는 일에 익숙하다.</p>
	{/if}
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
		gap: 26px;
	}
	.frag {
		margin: 0;
		padding-left: 16px;
		border-left: 2px solid rgba(143, 180, 204, 0.45);
		max-width: 520px;
	}
	.fx {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: clamp(18px, 2.6vw, 23px);
		line-height: 1.55;
		color: #e9ecf2;
		margin: 0;
	}
	cite {
		display: block;
		margin-top: 8px;
		font-style: normal;
		font-size: 13px;
		letter-spacing: 0.05em;
		color: rgba(143, 180, 204, 0.85);
	}
	.empty {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: clamp(16px, 2.2vw, 19px);
		color: rgba(233, 236, 242, 0.4);
		margin: 0;
	}
</style>
