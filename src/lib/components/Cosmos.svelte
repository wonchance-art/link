<script lang="ts">
	import { makeStars, makeBandStars } from '$lib/cosmos/stars';
	import { gratitudeStars, type GratitudeStar } from '$lib/cosmos/gratitude';

	type Props = { landPath: string };
	let { landPath }: Props = $props();

	const stars = makeStars(64);
	const bandStars = makeBandStars(150);

	// 감사의 별 — 호버/클릭
	let hoveredStar = $state<string | null>(null);
	let openedStar = $state<GratitudeStar | null>(null);

	let zoomedBody = $state<null | 'sun' | 'earth' | 'moon'>(null);
	let hovered = $state<null | 'sun' | 'earth' | 'moon'>(null);
	// 확대 시작 좌표(점이 있던 자리) — 화면 중심 기준 오프셋
	let startX = $state(0);
	let startY = $state(0);
	let liveLandPath = $state(''); // 자전 중 갱신, 비면 정적 landPath 사용

	let stageEl: HTMLDivElement | null = $state(null);
	let earthSystemEl: HTMLDivElement | null = $state(null);
	let moonEl: HTMLDivElement | null = $state(null);
	let raf: number | null = null;
	let earthRaf: number | null = null;

	const EARTH_PERIOD = 60000;
	const MOON_PERIOD = 12000;
	const EARTH_R_FRAC = 0.34;

	function captureStart(el: Element) {
		const r = el.getBoundingClientRect();
		startX = Math.round(r.left + r.width / 2 - window.innerWidth / 2);
		startY = Math.round(r.top + r.height / 2 - window.innerHeight / 2);
	}

	function zoomBody(body: 'sun' | 'earth' | 'moon', e: MouseEvent) {
		captureStart(e.currentTarget as Element);
		hovered = null;
		zoomedBody = body;
		if (body === 'earth') startEarthSpin();
	}

	function closeZoom() {
		zoomedBody = null;
		if (earthRaf) {
			cancelAnimationFrame(earthRaf);
			earthRaf = null;
		}
	}

	// 지구 자전 — 확대 시에만 d3-geo 동적 import, 저프레임 throttle로 천천히
	async function startEarthSpin() {
		liveLandPath = '';
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const { makeEarthRotator } = await import('$lib/cosmos/earthClient');
		const rotate = makeEarthRotator(100, 12);
		const PERIOD = 120000; // 한 바퀴 ≈ 2분
		const baseLon = 18;
		let startT = 0;
		let lastGen = 0;
		const loop = (t: number) => {
			if (zoomedBody !== 'earth') {
				earthRaf = null;
				return;
			}
			if (!startT) startT = t;
			if (t - lastGen > 80) {
				lastGen = t;
				liveLandPath = rotate(baseLon + ((t - startT) / PERIOD) * 360);
			}
			earthRaf = requestAnimationFrame(loop);
		};
		earthRaf = requestAnimationFrame(loop);
	}

	function frame(t: number) {
		if (stageEl && earthSystemEl) {
			const m = Math.min(stageEl.clientWidth, stageEl.clientHeight);
			const er = m * EARTH_R_FRAC;
			const a = (t / EARTH_PERIOD) * Math.PI * 2;
			earthSystemEl.style.transform = `translate(${Math.cos(a) * er}px, ${Math.sin(a) * er * 0.4}px)`;
			if (moonEl) {
				const mr = m * 0.065;
				const ma = (t / MOON_PERIOD) * Math.PI * 2;
				const my = Math.sin(ma) * mr * 0.5;
				moonEl.style.transform = `translate(${Math.cos(ma) * mr}px, ${my}px)`;
				moonEl.style.zIndex = my < 0 ? '1' : '4';
			}
		}
		raf = requestAnimationFrame(frame);
	}

	$effect(() => {
		const prevOf = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!reduce && !zoomedBody) {
			raf = requestAnimationFrame(frame);
		} else if (earthSystemEl) {
			const m = stageEl ? Math.min(stageEl.clientWidth, stageEl.clientHeight) : 600;
			earthSystemEl.style.transform = `translate(${m * EARTH_R_FRAC * 0.72}px, ${-m * 0.05}px)`;
			if (moonEl) moonEl.style.transform = `translate(${m * 0.06}px, ${-m * 0.02}px)`;
		}
		return () => {
			if (raf) cancelAnimationFrame(raf);
			raf = null;
			if (earthRaf) cancelAnimationFrame(earthRaf);
			earthRaf = null;
			document.body.style.overflow = prevOf;
		};
	});
</script>

<div class="stage" bind:this={stageEl} class:zoomed={zoomedBody}>
	<div class="milkyway" aria-hidden="true"></div>
	<div class="stars" aria-hidden="true">
		{#each bandStars as s, i (`b${i}`)}
			<span
				style:left="{s.x}%"
				style:top="{s.y}%"
				style:width="{s.r}px"
				style:height="{s.r}px"
				style:--o={s.o}
				style:animation-delay="{s.tw}s"
			></span>
		{/each}
		{#each stars as s, i (i)}
			<span
				style:left="{s.x}%"
				style:top="{s.y}%"
				style:width="{s.r}px"
				style:height="{s.r}px"
				style:--o={s.o}
				style:animation-delay="{s.tw}s"
			></span>
		{/each}
	</div>

	{#if !zoomedBody}
		<!-- 감사의 별들 — 은하(나의 세계)를 이루는, 누르면 글이 뜨는 별 -->
		<div class="gstars">
			{#each gratitudeStars as g (g.id)}
				<button
					class="gstar"
					class:active={openedStar?.id === g.id}
					style:left="{g.x}%"
					style:top="{g.y}%"
					onmouseenter={() => (hoveredStar = g.id)}
					onmouseleave={() => (hoveredStar = null)}
					onclick={() => (openedStar = g)}
					aria-label={g.name}
				>
					<span class="g-dot"></span>
					<span class="g-name" class:show={hoveredStar === g.id}>{g.name}</span>
				</button>
			{/each}
		</div>

		<div class="system">
			<!-- 태양 = 이성 -->
			<button
				class="hit sun"
				onmouseenter={() => (hovered = 'sun')}
				onmouseleave={() => (hovered = null)}
				onclick={(e) => zoomBody('sun', e)}
				aria-label="태양 · 이성"
			>
				<span class="dot"></span>
			</button>

			<!-- 지구계 -->
			<div class="earth-system" bind:this={earthSystemEl}>
				<button
					class="hit earth"
					onmouseenter={() => (hovered = 'earth')}
					onmouseleave={() => (hovered = null)}
					onclick={(e) => zoomBody('earth', e)}
					aria-label="지구 · 자기"
				>
					<span class="dot"></span>
				</button>
				<div class="moon-wrap" bind:this={moonEl}>
					<button
						class="hit moon"
						onmouseenter={() => (hovered = 'moon')}
						onmouseleave={() => (hovered = null)}
						onclick={(e) => zoomBody('moon', e)}
						aria-label="달 · 감성"
					>
						<span class="dot"></span>
					</button>
				</div>
			</div>
		</div>

		<div class="label" class:show={hovered}>
			{#if hovered === 'sun'}이성{:else if hovered === 'earth'}자기{:else if hovered === 'moon'}감성{/if}
		</div>

		<!-- 별을 누르면 그 글이 뜬다 -->
		{#if openedStar}
			<button class="star-backdrop" onclick={() => (openedStar = null)} aria-label="닫기"></button>
			<div class="star-card">
				<p class="sc-name">{openedStar.name}</p>
				<p class="sc-note">{openedStar.note}</p>
				<button class="sc-close" onclick={() => (openedStar = null)}>닫기</button>
			</div>
		{/if}
	{:else}
		<!-- 확대 뷰: 바깥(검정) 클릭 시 우주로 -->
		<button class="zoom-backdrop" onclick={closeZoom} aria-label="우주로 돌아가기"></button>

		{#if zoomedBody === 'earth'}
			<!-- 지구 확대 (자전) → 땅 / 바다, 텍스트 없이 -->
			<div class="zoom-obj world" style:--sx="{startX}px" style:--sy="{startY}px">
				<a class="sea" href="/sea" aria-label="바다"></a>
				<svg class="land-svg" viewBox="0 0 100 100">
					<a href="/land" aria-label="땅"><path d={liveLandPath || landPath} /></a>
				</svg>
				<span class="sphere" aria-hidden="true"></span>
			</div>
		{:else if zoomedBody === 'sun'}
			<!-- 태양 확대 (자전 표면) → /sun -->
			<a class="zoom-obj orb sun-orb" href="/sun" style:--sx="{startX}px" style:--sy="{startY}px" aria-label="태양 · 이성">
				<span class="surface sun-surface" aria-hidden="true"></span>
				<span class="sphere sun-sphere" aria-hidden="true"></span>
			</a>
		{:else if zoomedBody === 'moon'}
			<!-- 달 확대 (자전 표면) → /moon -->
			<a class="zoom-obj orb moon-orb" href="/moon" style:--sx="{startX}px" style:--sy="{startY}px" aria-label="달 · 감성">
				<span class="surface moon-surface" aria-hidden="true"></span>
				<span class="sphere" aria-hidden="true"></span>
			</a>
		{/if}

		<button class="back" onclick={closeZoom}>← 우주</button>
	{/if}
</div>

<style>
	.stage {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
		background: #06070c;
		color: #e9ecf2;
		font-family: var(--font-sans);
	}

	/* 은하수 — NASA Deep Star Maps(퍼블릭 도메인)의 실제 은하수 띠.
	   대각선으로 돌리고 남보라로 그레이딩, 은은하게. */
	.milkyway {
		/* 은하좌표계(직선 띠)를 대각선 직선으로 가로지름. 가장자리 페더링 */
		position: absolute;
		left: -42%;
		right: -42%;
		top: 18%;
		height: 64%;
		pointer-events: none;
		background: url('/milkyway.jpg') center / 100% 100% no-repeat;
		transform: rotate(-40deg);
		transform-origin: center;
		/* 남보라로 물들이고 은은하게 */
		filter: blur(2px) sepia(0.5) hue-rotate(205deg) saturate(1.6) brightness(0.86) contrast(1.05);
		opacity: 0.52;
		mix-blend-mode: screen;
		/* 직사각형 경계를 부드럽게 페이드 */
		-webkit-mask: radial-gradient(ellipse 82% 58% at 50% 50%, #000 22%, transparent 88%);
		mask: radial-gradient(ellipse 82% 58% at 50% 50%, #000 22%, transparent 88%);
	}

	/* 별 — 순수한 점 */
	.stars {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 1;
	}
	.stars span {
		position: absolute;
		border-radius: 50%;
		background: #fff;
		opacity: var(--o, 0.5);
		animation: twinkle 6s ease-in-out infinite;
	}
	@keyframes twinkle {
		0%,
		100% {
			opacity: var(--o, 0.5);
		}
		50% {
			opacity: calc(var(--o, 0.5) * 0.4);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.stars span {
			animation: none;
		}
	}

	.system {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
	}

	/* 클릭 히트영역(투명) + 점 */
	.hit {
		position: absolute;
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		margin: -15px 0 0 -15px;
		background: transparent;
		border: 0;
		padding: 0;
		cursor: pointer;
	}
	.hit .dot {
		border-radius: 50%;
		transition:
			transform 300ms ease,
			background 300ms ease;
	}
	.hit:hover .dot {
		transform: scale(1.35);
	}

	/* 태양 = 이성 (창백한 금빛 점) */
	.sun {
		left: 50%;
		top: 50%;
	}
	.sun .dot {
		width: 13px;
		height: 13px;
		background: #f5cd2e;
	}

	/* 지구계 */
	.earth-system {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 0;
		height: 0;
		z-index: 3;
		will-change: transform;
	}
	/* 지구 = pale blue dot */
	.earth {
		left: 0;
		top: 0;
	}
	.earth .dot {
		width: 9px;
		height: 9px;
		background: #9fc0da;
	}
	.moon-wrap {
		position: absolute;
		left: 0;
		top: 0;
		width: 0;
		height: 0;
		will-change: transform;
	}
	/* 달 = 감성 (창백한 회색 점) */
	.moon {
		left: 0;
		top: 0;
	}
	.moon .dot {
		width: 5px;
		height: 5px;
		background: #c9c9d2;
	}

	/* 호버 라벨 — 시적, 화면 아래 */
	.label {
		position: absolute;
		left: 50%;
		bottom: 64px;
		transform: translateX(-50%);
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 17px;
		letter-spacing: 0.04em;
		color: rgba(233, 236, 242, 0.7);
		opacity: 0;
		transition: opacity 260ms ease;
		pointer-events: none;
		min-height: 1em;
	}
	.label.show {
		opacity: 1;
	}

	/* === 감사의 별 — 누르면 글 === */
	.gstars {
		position: absolute;
		inset: 0;
		z-index: 1;
	}
	.gstar {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 26px;
		height: 26px;
		display: grid;
		place-items: center;
		border: 0;
		background: transparent;
		padding: 0;
		cursor: pointer;
	}
	.g-dot {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: #eaf0ff;
		box-shadow: 0 0 6px 1px rgba(200, 214, 255, 0.5);
		transition:
			transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 320ms ease;
		animation: gtwinkle 4.5s ease-in-out infinite;
	}
	@keyframes gtwinkle {
		0%,
		100% {
			opacity: 0.85;
		}
		50% {
			opacity: 0.5;
		}
	}
	.gstar:hover .g-dot,
	.gstar.active .g-dot {
		transform: scale(2.4);
		box-shadow:
			0 0 12px 3px rgba(200, 214, 255, 0.7),
			0 0 26px 8px rgba(120, 140, 220, 0.35);
		animation: none;
		opacity: 1;
	}
	.g-name {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translate(-50%, 4px);
		white-space: nowrap;
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 14px;
		color: rgba(233, 236, 242, 0.92);
		opacity: 0;
		transition: opacity 240ms ease;
		pointer-events: none;
		text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
	}
	.g-name.show {
		opacity: 1;
	}

	/* 별의 글 카드 */
	.star-backdrop {
		position: absolute;
		inset: 0;
		z-index: 6;
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
	.star-card {
		position: absolute;
		z-index: 7;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: min(420px, 86vw);
		padding: 34px 32px 26px;
		background: rgba(16, 19, 30, 0.9);
		border: 1px solid rgba(160, 180, 240, 0.18);
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
	.sc-name {
		font-size: 13px;
		letter-spacing: 0.1em;
		color: #aebfe8;
		margin: 0 0 16px;
	}
	.sc-note {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 21px;
		line-height: 1.55;
		color: #eef1f7;
		margin: 0 0 24px;
	}
	.sc-close {
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
	.sc-close:hover {
		background: rgba(233, 236, 242, 0.1);
		color: #fff;
	}

	/* === 천체 확대 (공용) === */
	/* 확대 뷰 배경: 바깥(검정) 클릭 → 우주로 */
	.zoom-backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		padding: 0;
		background: transparent;
		cursor: zoom-out;
		z-index: 1;
	}
	.zoom-obj {
		position: absolute;
		left: 50%;
		top: 50%;
		width: min(74vw, 74vh);
		height: min(74vw, 74vh);
		transform: translate(-50%, -50%);
		border-radius: 50%;
		overflow: hidden;
		/* 원형으로만 클릭 받도록(코너는 배경으로 통과 → 우주 전환) */
		clip-path: circle(50%);
		z-index: 2;
		/* 점이 있던 자리(--sx,--sy)에서 중앙으로 커진다 */
		animation: world-in 820ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.orb {
		display: block;
		cursor: pointer;
	}
	/* 태양 표면 (자전 스크롤) */
	.sun-orb {
		background: #f5cd2e;
	}
	.sun-surface {
		position: absolute;
		inset: 0;
		background-image:
			radial-gradient(circle at 18% 38%, rgba(255, 165, 35, 0.5), transparent 13%),
			radial-gradient(circle at 44% 66%, rgba(255, 220, 100, 0.45), transparent 11%),
			radial-gradient(circle at 68% 28%, rgba(212, 120, 14, 0.42), transparent 10%),
			radial-gradient(circle at 86% 58%, rgba(255, 198, 66, 0.4), transparent 12%),
			radial-gradient(circle at 30% 84%, rgba(230, 150, 30, 0.38), transparent 11%);
		background-size: 600px 100%;
		background-repeat: repeat;
		animation: surf 26s linear infinite;
	}
	.sun-sphere {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		pointer-events: none;
		box-shadow:
			inset -24px -28px 64px rgba(120, 60, 0, 0.42),
			inset 16px 18px 48px rgba(255, 244, 190, 0.28);
	}
	/* 달 표면 (자전 스크롤) */
	.moon-orb {
		background: #c9c9d2;
	}
	.moon-surface {
		position: absolute;
		inset: 0;
		background-image:
			radial-gradient(circle at 22% 44%, rgba(120, 120, 136, 0.55), transparent 15%),
			radial-gradient(circle at 54% 64%, rgba(140, 140, 154, 0.5), transparent 12%),
			radial-gradient(circle at 78% 34%, rgba(108, 108, 126, 0.5), transparent 11%),
			radial-gradient(circle at 40% 82%, rgba(150, 150, 162, 0.42), transparent 10%);
		background-size: 600px 100%;
		background-repeat: repeat;
		animation: surf 46s linear infinite;
	}
	@keyframes surf {
		to {
			background-position-x: 600px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sun-surface,
		.moon-surface {
			animation: none;
		}
	}
	@keyframes world-in {
		from {
			transform: translate(calc(-50% + var(--sx, 0px)), calc(-50% + var(--sy, 0px))) scale(0.03);
			opacity: 0.5;
		}
		to {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
	}
	/* 바다 = 전체 원 (지구 바다 블루) */
	.sea {
		position: absolute;
		inset: 0;
		background: #4f7ea2;
		cursor: pointer;
	}
	/* 땅 = 부드러운 SVG 대륙 — 칠해진 곳만 클릭, 나머지는 바다로 통과 */
	.land-svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.land-svg path {
		fill: #6c8b5c;
		pointer-events: auto;
		cursor: pointer;
		transition: fill 260ms ease;
	}
	.land-svg a:hover path {
		fill: #7c9c6a;
	}
	/* 구체감 — 한쪽이 살짝 어두워지는 옅은 음영 (플랫 유지, 둥글게만) */
	.sphere {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		pointer-events: none;
		box-shadow:
			inset -26px -30px 70px rgba(3, 8, 14, 0.4),
			inset 16px 18px 50px rgba(255, 255, 255, 0.08);
	}

	.back {
		position: absolute;
		top: 30px;
		left: 32px;
		border: 0;
		background: transparent;
		color: rgba(233, 236, 242, 0.6);
		font-size: 14px;
		cursor: pointer;
		transition: color 200ms ease;
		z-index: 3;
	}
	.back:hover {
		color: #fff;
	}

	@media (max-width: 640px) {
		.back {
			top: 22px;
			left: 22px;
		}
	}
</style>
