<script lang="ts">
	type Props = {
		name: string;
		subtitle: string;
		tag: string;
	};

	let { name, subtitle, tag }: Props = $props();

	const tagHtml = $derived(tag.replace(/\*(.+?)\*/g, '<em>$1</em>'));

	// 마우스 위치로 (1) 이름의 가변 폰트 weight (2) Hero 영역의 spotlight 위치 결정.
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
	<span class="mark">Open Chaence &nbsp;·&nbsp; Grove &nbsp;·&nbsp; Sky &nbsp;·&nbsp; Pond</span>
	<h1 class="name" bind:this={nameEl} style:font-weight={weight}>{name}</h1>
	<p class="subtitle">{subtitle}</p>
	<p class="tag">{@html tagHtml}</p>
</section>

<style>
	.hero {
		position: relative;
		margin-bottom: clamp(80px, 14vw, 128px);
		padding-top: var(--s-2);
		isolation: isolate;
	}

	/* 마우스 위치 따라가는 부드러운 spotlight — 영롱한 빛 */
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
		opacity: 0;
		transition: opacity 600ms ease;
		border-radius: 32px;
		filter: blur(8px);
	}
	.hero:hover::before {
		opacity: 1;
	}

	/* 잡지 모서리 시그니처 — vertical italic serif */
	.mark {
		position: absolute;
		right: -12px;
		top: 2px;
		writing-mode: vertical-rl;
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 11px;
		letter-spacing: 0.34em;
		color: var(--ink-faint);
		text-transform: uppercase;
		user-select: none;
		white-space: nowrap;
		font-variation-settings: 'opsz' 14;
	}

	.name {
		font-family: var(--font-sans);
		font-size: clamp(64px, 12vw, 128px);
		font-weight: 400;
		line-height: 0.92;
		letter-spacing: -0.045em;
		color: var(--ink);
		margin: 0 0 28px;
		transition: font-weight 260ms cubic-bezier(0.4, 0, 0.2, 1);
		cursor: default;
		font-feature-settings: 'ss01';
	}

	.subtitle {
		font-family: var(--font-serif);
		font-variation-settings: 'opsz' 144;
		font-size: 26px;
		font-weight: 400;
		font-style: italic;
		color: var(--accent);
		margin: 0 0 36px;
		letter-spacing: 0.005em;
		line-height: 1.2;
	}

	.tag {
		font-size: 16px;
		color: var(--ink-muted);
		line-height: 1.78;
		margin: 0;
		max-width: 460px;
	}
	.tag :global(em) {
		font-family: var(--font-serif);
		font-style: italic;
		color: var(--accent-deep);
		font-weight: 500;
		font-variation-settings: 'opsz' 14;
		font-size: 1.08em;
	}

	@media (max-width: 640px) {
		.subtitle {
			font-size: 22px;
			margin-bottom: 28px;
		}
		.tag {
			font-size: 15px;
		}
		.mark {
			right: -10px;
			font-size: 10px;
			letter-spacing: 0.3em;
		}
	}
</style>
