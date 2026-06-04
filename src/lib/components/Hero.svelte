<script lang="ts">
	type Props = {
		name: string;
		subtitle: string;
		tag: string;
	};

	let { name, subtitle, tag }: Props = $props();

	// *…* → <em>…</em>
	const tagHtml = $derived(tag.replace(/\*(.+?)\*/g, '<em>$1</em>'));

	// 마우스 근접에 따라 이름의 가변 폰트 weight 변화.
	// 거리 0 → 700, 거리 520+ → 380. 발견되는 디테일.
	let nameEl: HTMLElement | null = $state(null);
	let weight = $state(380);
	let rafId: number | null = null;

	function onPointerMove(e: PointerEvent) {
		if (rafId !== null) return;
		rafId = requestAnimationFrame(() => {
			rafId = null;
			if (!nameEl) return;
			const rect = nameEl.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const dx = e.clientX - cx;
			const dy = e.clientY - cy;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const t = Math.max(0, Math.min(1, 1 - dist / 520));
			weight = Math.round(380 + t * 340);
		});
	}

	$effect(() => {
		// 마우스(pointer:fine) 환경에서만. 터치는 그대로.
		const mql = window.matchMedia('(pointer: fine)');
		if (!mql.matches) return;
		window.addEventListener('pointermove', onPointerMove);
		return () => {
			window.removeEventListener('pointermove', onPointerMove);
			if (rafId !== null) cancelAnimationFrame(rafId);
		};
	});
</script>

<section class="hero">
	<h1 class="name" bind:this={nameEl} style:font-weight={weight}>{name}</h1>
	<p class="subtitle">{subtitle}</p>
	<p class="tag">{@html tagHtml}</p>
</section>

<style>
	.hero {
		position: relative;
		margin-bottom: var(--s-7);
		padding-top: var(--s-2);
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
	}
</style>
