<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { moons, type Moon } from '$lib/content/chronicle';
	import { buildRingTexture } from '$lib/cosmos/saturnRing';

	// Chronos의 서가 — 실제 토성 위성들이 실측 비율로 돌고, 각 위성은 주제의 서랍.
	const ORBIT_TILT = 0.52; // 우주(Cosmos)와 동일한 황도면 기울기

	let stageEl: HTMLDivElement | null = $state(null);
	let moonEls: (HTMLDivElement | null)[] = $state(Array(moons.length).fill(null));
	let ringTexture = $state('');
	let raf: number | null = null;

	// 열린 위성 카드 — 다이얼로그(포커스 이동·순환·복귀)
	let openedMoon = $state<Moon | null>(null);
	let cardEl: HTMLDivElement | null = $state(null);
	let lastFocused: HTMLElement | null = null;

	function openMoon(mn: Moon, e: MouseEvent) {
		lastFocused = e.currentTarget as HTMLElement;
		openedMoon = mn;
	}
	function closeMoon() {
		openedMoon = null;
		lastFocused?.focus();
		lastFocused = null;
	}
	function trapTab(e: KeyboardEvent) {
		if (e.key !== 'Tab' || !cardEl) return;
		const f = cardEl.querySelectorAll<HTMLElement>('button, a[href]');
		if (!f.length) return;
		const first = f[0];
		const last = f[f.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && openedMoon) closeMoon();
	}
	$effect(() => {
		if (openedMoon && cardEl) {
			cardEl.querySelector<HTMLButtonElement>('.mc-close')?.focus();
		}
	});

	// 위성 공전 — 각 위성의 초기 위상은 황금각으로 분산
	function place(t: number) {
		if (!stageEl) return;
		const m = Math.min(stageEl.clientWidth, stageEl.clientHeight);
		for (let i = 0; i < moons.length; i++) {
			const el = moonEls[i];
			if (!el) continue;
			const mn = moons[i];
			const a = (t / (mn.T * 1000)) * Math.PI * 2 + i * 2.4;
			const x = Math.cos(a) * m * mn.distFrac;
			const y = -Math.sin(a) * m * mn.distFrac * ORBIT_TILT;
			el.style.transform = `translate(${x}px, ${y}px)`;
			// 궤도 위쪽(뒤편)이면 토성 뒤로
			el.style.zIndex = y < 0 ? '0' : '4';
		}
	}
	function frame(t: number) {
		place(t);
		raf = requestAnimationFrame(frame);
	}

	$effect(() => {
		buildRingTexture().then((url) => (ringTexture = url));
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const onVisibility = () => {
			if (document.hidden) {
				if (raf) cancelAnimationFrame(raf);
				raf = null;
			} else if (!reduce && !raf) {
				raf = requestAnimationFrame(frame);
			}
		};
		document.addEventListener('visibilitychange', onVisibility);
		place(0); // 첫 페인트부터 각자의 자리에 (rAF 시작 전 스택 방지)
		if (!reduce) raf = requestAnimationFrame(frame);
		return () => {
			if (raf) cancelAnimationFrame(raf);
			raf = null;
			document.removeEventListener('visibilitychange', onVisibility);
		};
	});
</script>

<Seo title="토성 · Chronos — Open Chaence" description="시간. 쌓이고 잊히고, 그래도 남는 자리." />

<svelte:window onkeydown={onKeydown} />

<div class="chronos" bind:this={stageEl}>
	<a class="back" href="/">← 우주</a>

	<header>
		<p class="eyebrow">Chronos</p>
		<h1>토성</h1>
		<p class="poem">시간. 쌓이고 잊히고, 그래도 남는 자리.</p>
	</header>

	<!-- 토성 본체 + 고리 (우주 확대뷰와 같은 문법, 작게) -->
	<div class="saturn" aria-hidden="true">
		<span class="ring ring-back" style:background-image="url({ringTexture})"></span>
		<span class="globe"><span class="surface"></span><span class="sphere"></span></span>
		<span class="ring ring-front" style:background-image="url({ringTexture})"></span>
	</div>

	<!-- 위성들 — 각자의 주제를 지닌 서랍 -->
	{#each moons as mn, i (mn.key)}
		<div class="moon-wrap" bind:this={moonEls[i]}>
			<button
				class="moon-hit"
				onclick={(e) => openMoon(mn, e)}
				aria-label="{mn.name} · {mn.theme}"
			>
				<span class="moon-dot" style:--c={mn.color} style:--s="{mn.size}px"></span>
			</button>
		</div>
	{/each}

	{#if openedMoon}
		<button class="backdrop" onclick={closeMoon} aria-label="닫기"></button>
		<div
			class="moon-card"
			bind:this={cardEl}
			role="dialog"
			aria-modal="true"
			aria-label="{openedMoon.name} · {openedMoon.theme}"
			tabindex="-1"
			onkeydown={trapTab}
		>
			<p class="mc-name">{openedMoon.name}</p>
			<p class="mc-theme">{openedMoon.theme}</p>
			<p class="mc-note">{openedMoon.note}</p>
			{#if openedMoon.entries.length}
				<div class="mc-entries">
					{#each openedMoon.entries as en, j (j)}
						<article>
							{#if en.date || en.title}
								<p class="mc-meta">{[en.date, en.title].filter(Boolean).join(' · ')}</p>
							{/if}
							<p class="mc-text">{en.text}</p>
						</article>
					{/each}
				</div>
			{:else}
				<p class="mc-empty">아직 담긴 글이 없다.</p>
			{/if}
			<button class="mc-close" onclick={closeMoon}>닫기</button>
		</div>
	{/if}
</div>

<style>
	.chronos {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
		background: #000;
		color: #e9ecf2;
		font-family: var(--font-sans);
	}

	.back {
		position: absolute;
		left: clamp(20px, 5vw, 44px);
		top: clamp(20px, 4vw, 40px);
		z-index: 6;
		font-size: 13px;
		letter-spacing: 0.04em;
		color: rgba(233, 236, 242, 0.5);
		transition: color 220ms ease;
	}
	.back:hover {
		color: #d0c0a4;
	}

	header {
		position: absolute;
		left: clamp(20px, 5vw, 44px);
		bottom: clamp(24px, 5vw, 48px);
		z-index: 6;
		pointer-events: none;
	}
	.eyebrow {
		font-size: 12px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #d0c0a4;
		margin: 0 0 10px;
	}
	h1 {
		font-size: clamp(28px, 5vw, 44px);
		font-weight: 500;
		letter-spacing: -0.02em;
		margin: 0;
		color: #f3f5f8;
	}
	.poem {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: clamp(14px, 2vw, 17px);
		color: rgba(233, 236, 242, 0.55);
		margin: 10px 0 0;
	}

	/* === 토성 본체 === */
	.saturn {
		position: absolute;
		left: 50%;
		top: 50%;
		/* 고리 바깥(≈0.175·최소변)이 가장 안쪽 위성 궤도(0.19) 안에 들어오는 크기 */
		width: 16vmin;
		height: 16vmin;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}
	.globe {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		overflow: hidden;
		display: block;
		background: #d0c0a4;
		z-index: 2;
	}
	.surface {
		position: absolute;
		inset: 0;
		display: block;
		background: url('/saturn.webp') center / cover no-repeat;
		filter: blur(10px) saturate(1.12) brightness(1.04);
		transform: scale(1.3);
	}
	.sphere {
		position: absolute;
		inset: 0;
		display: block;
		border-radius: 50%;
		background: radial-gradient(
			circle at 38% 34%,
			transparent 42%,
			rgba(0, 0, 0, 0.32) 76%,
			rgba(0, 0, 0, 0.6) 100%
		);
		box-shadow:
			inset -12px -14px 34px rgba(0, 0, 0, 0.5),
			inset 8px 9px 24px rgba(255, 255, 255, 0.07);
	}
	.ring {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 218%;
		aspect-ratio: 1 / 1;
		transform: translate(-50%, -50%) rotateX(67deg) rotate(-16deg);
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;
		pointer-events: none;
	}
	.ring-back {
		z-index: 1;
		filter: brightness(0.78);
	}
	.ring-front {
		z-index: 3;
		-webkit-mask: linear-gradient(to bottom, transparent 50%, #000 52%);
		mask: linear-gradient(to bottom, transparent 50%, #000 52%);
	}

	/* === 위성 === */
	.moon-wrap {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 0;
		height: 0;
		will-change: transform;
	}
	.moon-hit {
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(-50%, -50%);
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		border: 0;
		padding: 0;
		background: transparent;
		cursor: pointer;
	}
	.moon-dot {
		width: var(--s);
		height: var(--s);
		border-radius: 50%;
		background: var(--c);
		box-shadow:
			inset -1px -1px 2px rgba(0, 0, 0, 0.35),
			0 0 7px 1px rgba(255, 255, 255, 0.18);
		transition: transform 300ms ease;
	}
	@media (hover: hover) {
		.moon-hit:hover .moon-dot {
			transform: scale(1.6);
		}
	}
	.moon-hit:active .moon-dot {
		transform: scale(1.6);
	}

	/* === 위성 카드 — 별카드와 같은 문법 === */
	.backdrop {
		position: absolute;
		inset: 0;
		z-index: 7;
		border: 0;
		background: rgba(6, 7, 12, 0.55);
		backdrop-filter: blur(3px);
		cursor: zoom-out;
		animation: fade 280ms ease;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.moon-card {
		position: absolute;
		z-index: 8;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: min(460px, 88vw);
		max-height: 78vh;
		overflow-y: auto;
		padding: 34px 32px 26px;
		background: rgba(16, 19, 30, 0.9);
		border: 1px solid rgba(208, 192, 164, 0.22);
		border-radius: 18px;
		box-shadow: 0 30px 80px -24px rgba(0, 0, 0, 0.7);
		animation: card-rise 420ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes card-rise {
		from {
			transform: translate(-50%, calc(-50% + 14px));
			opacity: 0;
		}
		to {
			transform: translate(-50%, -50%);
			opacity: 1;
		}
	}
	.mc-name {
		font-size: 12px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #d0c0a4;
		margin: 0 0 6px;
	}
	.mc-theme {
		font-size: 26px;
		font-weight: 500;
		color: #eef1f7;
		margin: 0 0 12px;
	}
	.mc-note {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 16px;
		line-height: 1.55;
		color: rgba(233, 236, 242, 0.6);
		margin: 0 0 22px;
	}
	.mc-entries {
		display: grid;
		gap: 18px;
		margin: 0 0 24px;
	}
	.mc-meta {
		font-size: 12px;
		letter-spacing: 0.08em;
		color: rgba(174, 191, 232, 0.85);
		margin: 0 0 6px;
	}
	.mc-text {
		font-family: var(--font-serif);
		font-size: 17px;
		line-height: 1.65;
		color: #eef1f7;
		margin: 0;
		white-space: pre-line;
	}
	.mc-empty {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 16px;
		color: rgba(233, 236, 242, 0.4);
		margin: 0 0 24px;
	}
	.mc-close {
		border: 1px solid rgba(233, 236, 242, 0.18);
		background: transparent;
		color: rgba(233, 236, 242, 0.8);
		border-radius: 999px;
		padding: 7px 18px;
		font-size: 13px;
		cursor: pointer;
		transition:
			background 200ms ease,
			color 200ms ease;
	}
	.mc-close:hover {
		background: rgba(233, 236, 242, 0.1);
		color: #fff;
	}

	@media (prefers-reduced-motion: reduce) {
		.moon-dot {
			transition: none;
		}
		.backdrop,
		.moon-card {
			animation: none;
		}
	}
</style>
