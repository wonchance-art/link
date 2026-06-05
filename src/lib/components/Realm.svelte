<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		theme: string;
		poem: string;
		accent: string;
		children?: Snippet;
	};
	let { title, theme, poem, accent, children }: Props = $props();
</script>

<main class="realm" style:--accent={accent}>
	<a class="back" href="/">← 우주</a>

	<header>
		<p class="theme">{theme}</p>
		<h1>{title}</h1>
		<p class="poem">{poem}</p>
	</header>

	{#if children}
		<section class="content">{@render children()}</section>
	{/if}

	<footer>
		<a class="wonnit" href="/works">Wonnit →</a>
	</footer>
</main>

<style>
	.realm {
		min-height: 100vh;
		max-width: 640px;
		margin: 0 auto;
		padding: clamp(48px, 9vw, 96px) clamp(24px, 6vw, 48px) 72px;
		color: #e9ecf2;
		display: flex;
		flex-direction: column;
	}
	.back {
		font-size: 13px;
		letter-spacing: 0.04em;
		color: rgba(233, 236, 242, 0.5);
		transition: color 220ms ease;
		margin-bottom: clamp(40px, 9vw, 88px);
	}
	.back:hover {
		color: var(--accent);
	}
	.theme {
		font-size: 12px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
		margin: 0 0 18px;
	}
	h1 {
		font-family: var(--font-sans);
		font-size: clamp(56px, 13vw, 120px);
		font-weight: 500;
		line-height: 0.92;
		letter-spacing: -0.04em;
		margin: 0;
		color: #f3f5f8;
	}
	.poem {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: clamp(18px, 2.6vw, 24px);
		line-height: 1.6;
		color: rgba(233, 236, 242, 0.66);
		margin: 28px 0 0;
		max-width: 460px;
	}
	.content {
		margin-top: clamp(48px, 9vw, 88px);
	}
	footer {
		margin-top: auto;
		padding-top: 72px;
	}
	.wonnit {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 16px;
		color: rgba(233, 236, 242, 0.4);
		transition: color 240ms ease;
	}
	.wonnit:hover {
		color: var(--accent);
	}
</style>
