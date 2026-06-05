<script lang="ts">
	import type { ProfileData } from '$lib/content/profile';
	import WindText from './WindText.svelte';

	type Props = { profile: ProfileData };
	let { profile: p }: Props = $props();

	const tagHtml = $derived(p.tag.replace(/\*(.+?)\*/g, '<em>$1</em>'));
</script>

<header class="hero">
	<div class="topline">
		<svg class="sig" viewBox="0 0 44 22" aria-hidden="true">
			<path d="M3 11 Q 7 3, 13 5 Q 15 11, 11 18 Q 5 17, 3 11 Z" fill="currentColor" opacity="0.9" />
			<line x1="8" y1="5.5" x2="11" y2="17" stroke="currentColor" stroke-width="0.6" opacity="0.55" />
			<circle cx="22" cy="11" r="1.5" fill="currentColor" opacity="0.5" />
			<circle cx="29" cy="11" r="1.2" fill="currentColor" opacity="0.36" />
			<circle cx="36" cy="11" r="0.9" fill="currentColor" opacity="0.24" />
		</svg>
		<span class="coords">{p.location} · {p.field} · {p.updated}</span>
	</div>

	<h1 class="name"><WindText text={p.name} /></h1>

	<p class="brand">{p.subtitle}</p>
	<p class="tag">{@html tagHtml}</p>
</header>

<style>
	.hero {
		position: relative;
		margin-bottom: clamp(96px, 16vw, 168px);
		padding-top: 8px;
		isolation: isolate;
	}

	/* 추상 wash blob — 모네 수면 같은 색 번짐 (배경 깊이) */
	.hero::after {
		content: '';
		position: absolute;
		inset: -120px -140px 0;
		pointer-events: none;
		z-index: -2;
		background:
			radial-gradient(ellipse 380px 260px at 82% 62%, rgba(78, 107, 74, 0.13) 0%, transparent 70%),
			radial-gradient(ellipse 300px 240px at 64% 18%, rgba(74, 107, 122, 0.1) 0%, transparent 70%),
			radial-gradient(ellipse 220px 300px at 96% 88%, rgba(122, 153, 110, 0.08) 0%, transparent 70%);
		filter: blur(34px);
		opacity: 0.9;
	}

	.topline {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: clamp(36px, 7vw, 72px);
		opacity: 0;
		animation: fade-in 700ms ease-out 200ms forwards;
	}
	.sig {
		width: 44px;
		height: 22px;
		color: var(--accent-deep);
		flex: 0 0 auto;
	}
	.coords {
		font-size: 12px;
		letter-spacing: 0.06em;
		color: var(--ink-faint);
		font-variant-numeric: tabular-nums;
	}

	.name {
		font-family: var(--font-sans);
		font-size: clamp(64px, 15vw, 168px);
		line-height: 0.88;
		letter-spacing: -0.05em;
		color: var(--ink);
		margin: 0;
		cursor: default;
		font-feature-settings: 'ss01';
		word-break: keep-all;
		overflow-wrap: break-word;
	}

	.brand {
		font-family: var(--font-serif);
		font-style: italic;
		font-weight: 400;
		font-variation-settings: 'opsz' 144;
		font-feature-settings: 'liga', 'dlig';
		font-size: clamp(22px, 3.4vw, 34px);
		color: var(--accent);
		margin: 24px 0 0;
		letter-spacing: 0.004em;
		opacity: 0;
		animation: fade-in 800ms ease-out 760ms forwards;
	}

	.tag {
		font-size: clamp(16px, 2vw, 20px);
		color: var(--ink-muted);
		line-height: 1.72;
		margin: 28px 0 0;
		max-width: 540px;
		opacity: 0;
		animation: fade-in 800ms ease-out 920ms forwards;
	}
	.tag :global(em) {
		font-family: var(--font-serif);
		font-style: italic;
		color: var(--accent-deep);
		font-weight: 500;
		font-variation-settings: 'opsz' 14;
		font-feature-settings: 'liga', 'dlig';
		font-size: 1.08em;
		transition:
			color 280ms ease,
			letter-spacing 280ms ease;
	}
	.tag :global(em:hover) {
		color: var(--accent);
		letter-spacing: 0.01em;
	}

	@keyframes fade-in {
		to {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.topline,
		.brand,
		.tag {
			opacity: 1;
			animation: none;
		}
	}

	@media (max-width: 640px) {
		.name {
			font-size: clamp(60px, 19vw, 96px);
		}
	}
</style>
