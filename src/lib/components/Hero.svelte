<script lang="ts">
	import type { ProfileData } from '$lib/content/profile';

	type Props = { profile: ProfileData };
	let { profile: p }: Props = $props();

	const tagHtml = $derived(p.tag.replace(/\*(.+?)\*/g, '<em>$1</em>'));

	// 마우스 위치로 (1) 이름의 가변 폰트 weight (2) Hero 영역의 spotlight 위치.
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
		<span class="palette" aria-hidden="true">
			<span style:background="var(--accent)"></span>
			<span style:background="var(--accent-pond)"></span>
			<span style:background="var(--ink-faint)"></span>
		</span>
	</aside>
</section>

<style>
	.hero {
		position: relative;
		margin-bottom: clamp(80px, 14vw, 128px);
		padding-top: var(--s-2);
		isolation: isolate;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 140px;
		column-gap: 40px;
		align-items: start;
	}

	/* spotlight — 항상 옅게 켜져 있고, 호버 시 강해짐 */
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

	/* Name 글자별 stagger entrance — 모바일 시그니처 모먼트 */
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
	@media (prefers-reduced-motion: reduce) {
		.name .char,
		.name .space {
			opacity: 1;
			transform: none;
			animation: none;
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

	/* === Metadata column — 잡지 표지 식 우측 정보 === */
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
		.tag,
		.meta {
			opacity: 1;
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

	.meta .palette {
		display: flex;
		gap: 5px;
	}
	.meta .palette span {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
	}

	/* === Mobile: stack — 위에 meta(가로 row), 아래에 name+tag === */
	@media (max-width: 640px) {
		.hero {
			grid-template-columns: 1fr;
			row-gap: 28px;
		}
		.meta {
			order: -1; /* meta가 name 위로 */
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
		.meta .palette {
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
