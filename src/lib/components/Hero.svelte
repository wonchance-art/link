<script lang="ts">
	import type { ProfileData } from '$lib/content/profile';

	type Props = { profile: ProfileData };
	let { profile: p }: Props = $props();

	const tagHtml = $derived(p.tag.replace(/\*(.+?)\*/g, '<em>$1</em>'));

	let nameEl: HTMLElement | null = $state(null);
	let heroEl: HTMLElement | null = $state(null);
	let weight = $state(380);
	let sx = $state(50);
	let sy = $state(50);
	let rafId: number | null = null;

	function onPointerMove(e: PointerEvent) {
		if (rafId !== null) return;
		rafId = requestAnimationFrame(() => {
			rafId = null;
			if (nameEl) {
				const r = nameEl.getBoundingClientRect();
				const dx = e.clientX - (r.left + r.width / 2);
				const dy = e.clientY - (r.top + r.height / 2);
				const dist = Math.sqrt(dx * dx + dy * dy);
				const t = Math.max(0, Math.min(1, 1 - dist / 520));
				weight = Math.round(380 + t * 340);
			}
			if (heroEl) {
				const r = heroEl.getBoundingClientRect();
				sx = ((e.clientX - r.left) / r.width) * 100;
				sy = ((e.clientY - r.top) / r.height) * 100;
			}
		});
	}

	$effect(() => {
		const mql = window.matchMedia('(pointer: fine)');
		if (!mql.matches) return;
		window.addEventListener('pointermove', onPointerMove);
		return () => {
			window.removeEventListener('pointermove', onPointerMove);
			if (rafId !== null) cancelAnimationFrame(rafId);
		};
	});
</script>

<section class="hero" bind:this={heroEl} style:--sx="{sx}%" style:--sy="{sy}%">
	<!-- 시그니처 마크 — Open Chaence의 시각 정체성 (잎 + 점 페이드) -->
	<svg class="signature" viewBox="0 0 44 22" aria-hidden="true">
		<path
			d="M3 11 Q 7 3, 13 5 Q 15 11, 11 18 Q 5 17, 3 11 Z"
			fill="currentColor"
			opacity="0.88"
		/>
		<line x1="8" y1="5.5" x2="11" y2="17" stroke="currentColor" stroke-width="0.6" opacity="0.55" />
		<circle cx="22" cy="11" r="1.5" fill="currentColor" opacity="0.55" />
		<circle cx="29" cy="11" r="1.2" fill="currentColor" opacity="0.4" />
		<circle cx="36" cy="11" r="0.9" fill="currentColor" opacity="0.28" />
	</svg>

	<div class="left">
		<h1 class="name" bind:this={nameEl} style:font-weight={weight}>
			{#each [...p.name] as char, i (i)}
				{#if char === ' '}
					<span class="space" style:--i={i}> </span>
				{:else}
					<span class="char" style:--i={i}>{char}</span>
				{/if}
			{/each}
		</h1>
		<p class="tag">{@html tagHtml}</p>
	</div>

	<aside class="meta" aria-label="Site info">
		<span class="brand">{p.subtitle}</span>
		<hr class="rule" aria-hidden="true" />
		<ul class="info">
			<li>{p.location}</li>
			<li>{p.field}</li>
			<li>{p.updated}</li>
		</ul>
		<hr class="rule" aria-hidden="true" />
		<span class="ornaments" aria-hidden="true">
			<svg viewBox="0 0 20 18" class="leaf">
				<path
					d="M2 9 Q 6 2, 11 4 Q 13 9, 9 16 Q 4 15, 2 9 Z"
					fill="var(--accent)"
					opacity="0.88"
				/>
				<line
					x1="6"
					y1="4.5"
					x2="9"
					y2="15.5"
					stroke="var(--accent-deep)"
					stroke-width="0.5"
					opacity="0.55"
				/>
			</svg>
			<svg viewBox="0 0 20 18" class="leaf">
				<path
					d="M2 10 Q 6 3, 11 5 Q 13 10, 9 16 Q 4 15, 2 10 Z"
					fill="var(--accent-pond)"
					opacity="0.72"
				/>
			</svg>
			<span class="dot"></span>
		</span>
	</aside>
</section>

<style>
	.hero {
		position: relative;
		margin-bottom: clamp(80px, 14vw, 128px);
		padding-top: 40px;
		isolation: isolate;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 140px;
		column-gap: 40px;
		align-items: start;
	}

	/* === 시그니처 마크 — Hero 좌상단 (Open Chaence 시각 정체성) === */
	.signature {
		position: absolute;
		top: 4px;
		left: 0;
		width: 44px;
		height: 22px;
		color: var(--accent-deep);
		opacity: 0;
		animation: fade-in 700ms ease-out 500ms forwards;
	}

	/* === 추상 wash blob — 모네 수면 같은 색 번짐 (배경 깊이) === */
	.hero::after {
		content: '';
		position: absolute;
		inset: -100px;
		pointer-events: none;
		z-index: -2;
		background:
			radial-gradient(
				ellipse 360px 240px at 78% 65%,
				rgba(78, 107, 74, 0.12) 0%,
				transparent 70%
			),
			radial-gradient(
				ellipse 280px 220px at 68% 25%,
				rgba(74, 107, 122, 0.09) 0%,
				transparent 70%
			),
			radial-gradient(
				ellipse 200px 280px at 92% 85%,
				rgba(122, 153, 110, 0.07) 0%,
				transparent 70%
			);
		filter: blur(30px);
		opacity: 0.9;
	}

	/* spotlight (이전) — 마우스 따라가는 빛 */
	.hero::before {
		content: '';
		position: absolute;
		inset: -80px -80px;
		pointer-events: none;
		z-index: -1;
		background: radial-gradient(
			circle 360px at var(--sx, 50%) var(--sy, 50%),
			rgba(78, 107, 74, 0.13) 0%,
			rgba(74, 107, 122, 0.05) 30%,
			transparent 60%
		);
		opacity: 0.32;
		transition: opacity 600ms ease;
		border-radius: 32px;
		filter: blur(8px);
	}
	.hero:hover::before {
		opacity: 1;
	}

	.left {
		min-width: 0;
	}

	.name {
		font-family: var(--font-sans);
		font-size: clamp(56px, 10.5vw, 116px);
		font-weight: 400;
		line-height: 0.94;
		letter-spacing: -0.045em;
		color: var(--ink);
		margin: 0 0 32px;
		transition: font-weight 260ms cubic-bezier(0.4, 0, 0.2, 1);
		cursor: default;
		font-feature-settings: 'ss01';
		word-break: break-word;
		overflow-wrap: break-word;
	}

	.name .char,
	.name .space {
		display: inline-block;
		opacity: 0;
		transform: translateY(28px);
		animation: char-rise 860ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
		animation-delay: calc(var(--i, 0) * 90ms + 100ms);
	}
	.name .space {
		white-space: pre;
	}
	@keyframes char-rise {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.tag {
		font-size: 16px;
		color: var(--ink-muted);
		line-height: 1.78;
		margin: 0;
		max-width: 460px;
		opacity: 0;
		animation: fade-in 700ms ease-out 720ms forwards;
	}
	.tag :global(em) {
		font-family: var(--font-serif);
		font-style: italic;
		color: var(--accent-deep);
		font-weight: 500;
		font-variation-settings: 'opsz' 14;
		font-feature-settings: 'liga', 'dlig';
		font-size: 1.08em;
	}

	/* === Metadata column === */
	.meta {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding-top: 12px;
		font-family: var(--font-sans);
		opacity: 0;
		animation: fade-in 700ms ease-out 900ms forwards;
	}

	@keyframes fade-in {
		to {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.name .char,
		.name .space,
		.tag,
		.meta,
		.signature {
			opacity: 1;
			transform: none;
			animation: none;
		}
	}

	.meta .brand {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 17px;
		font-weight: 400;
		color: var(--accent);
		letter-spacing: 0.005em;
		line-height: 1.2;
		font-variation-settings: 'opsz' 144;
		font-feature-settings: 'liga', 'dlig';
	}

	.meta .rule {
		border: 0;
		height: 1px;
		background: var(--line);
		margin: 0;
	}

	.meta .info {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.meta .info li {
		font-size: 12px;
		color: var(--ink-muted);
		letter-spacing: 0.01em;
		line-height: 1.45;
	}

	/* === Ornaments — 잎 두 장 + 점 (이전 palette 3색 점 대체) === */
	.meta .ornaments {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.meta .ornaments .leaf {
		width: 16px;
		height: 14px;
	}
	.meta .ornaments .dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--ink-faint);
		opacity: 0.55;
	}

	@media (max-width: 640px) {
		.hero {
			grid-template-columns: 1fr;
			row-gap: 28px;
			padding-top: 36px;
		}
		.signature {
			width: 38px;
			height: 19px;
			top: 2px;
		}
		.meta {
			order: -1;
			flex-direction: row;
			align-items: center;
			gap: 14px;
			flex-wrap: wrap;
			padding-top: 0;
		}
		.meta .brand {
			font-size: 15px;
		}
		.meta .rule {
			display: none;
		}
		.meta .info {
			flex-direction: row;
			gap: 14px;
			flex-wrap: wrap;
		}
		.meta .info li {
			font-size: 11px;
		}
		.meta .info li:not(:first-of-type)::before {
			content: '·';
			color: var(--ink-faint);
			margin-right: 8px;
		}
		.meta .ornaments {
			margin-left: auto;
		}
		.name {
			font-size: clamp(56px, 16vw, 88px);
		}
		.tag {
			font-size: 15px;
		}
	}
</style>
