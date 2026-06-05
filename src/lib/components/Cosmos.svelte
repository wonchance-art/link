<script lang="ts">
	import { makeStars } from '$lib/cosmos/stars';

	const stars = makeStars(80);

	let zoomed = $state(false);
	let hovered = $state<null | 'sun' | 'earth' | 'moon'>(null);
	// 지구 확대 시작 좌표(점이 있던 자리) — 화면 중심 기준 오프셋
	let startX = $state(0);
	let startY = $state(0);

	function zoomEarth() {
		if (earthSystemEl) {
			const r = earthSystemEl.getBoundingClientRect();
			startX = Math.round(r.left - window.innerWidth / 2);
			startY = Math.round(r.top - window.innerHeight / 2);
		}
		zoomed = true;
	}

	let stageEl: HTMLDivElement | null = $state(null);
	let earthSystemEl: HTMLDivElement | null = $state(null);
	let moonEl: HTMLDivElement | null = $state(null);
	let raf: number | null = null;

	const EARTH_PERIOD = 60000;
	const MOON_PERIOD = 12000;
	const EARTH_R_FRAC = 0.34;

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
		if (!reduce && !zoomed) {
			raf = requestAnimationFrame(frame);
		} else if (earthSystemEl) {
			const m = stageEl ? Math.min(stageEl.clientWidth, stageEl.clientHeight) : 600;
			earthSystemEl.style.transform = `translate(${m * EARTH_R_FRAC * 0.72}px, ${-m * 0.05}px)`;
			if (moonEl) moonEl.style.transform = `translate(${m * 0.06}px, ${-m * 0.02}px)`;
		}
		return () => {
			if (raf) cancelAnimationFrame(raf);
			raf = null;
			document.body.style.overflow = prevOf;
		};
	});
</script>

<div class="stage" bind:this={stageEl} class:zoomed>
	<div class="stars" aria-hidden="true">
		{#each stars as s, i (i)}
			<span style:left="{s.x}%" style:top="{s.y}%" style:width="{s.r}px" style:height="{s.r}px" style:opacity={s.o}></span>
		{/each}
	</div>

	{#if !zoomed}
		<div class="system">
			<!-- 태양 = 이성 -->
			<a
				class="hit sun"
				href="/sun"
				onmouseenter={() => (hovered = 'sun')}
				onmouseleave={() => (hovered = null)}
				aria-label="태양 · 이성"
			>
				<span class="dot"></span>
			</a>

			<!-- 지구계 -->
			<div class="earth-system" bind:this={earthSystemEl}>
				<button
					class="hit earth"
					onmouseenter={() => (hovered = 'earth')}
					onmouseleave={() => (hovered = null)}
					onclick={zoomEarth}
					aria-label="지구 · 자기 — 눌러서 들어가기"
				>
					<span class="dot"></span>
				</button>
				<div class="moon-wrap" bind:this={moonEl}>
					<a
						class="hit moon"
						href="/moon"
						onmouseenter={() => (hovered = 'moon')}
						onmouseleave={() => (hovered = null)}
						aria-label="달 · 감성"
					>
						<span class="dot"></span>
					</a>
				</div>
			</div>
		</div>

		<div class="label" class:show={hovered}>
			{#if hovered === 'sun'}이성{:else if hovered === 'earth'}자기{:else if hovered === 'moon'}감성{/if}
		</div>
	{:else}
		<!-- 지구 확대 → 땅 / 바다 (텍스트 없이, 직접 드러내지 않음) -->
		<div class="world" style:--sx="{startX}px" style:--sy="{startY}px">
			<a class="sea" href="/sea" aria-label="바다"></a>
			<svg class="land-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
				<a href="/land" aria-label="땅">
					<!-- 땅 비율을 높여 지구다운 대륙감 -->
					<path
						d="M26 16 C40 9 58 11 68 19 C76 25 72 35 79 43 C86 51 78 59 67 57 C58 55 53 66 42 64 C31 62 28 50 24 43 C19 36 20 26 24 20 C25 18 24 17 26 16 Z"
					/>
					<path
						d="M11 27 C18 21 27 23 28 32 C29 41 22 48 25 57 C28 66 20 74 12 69 C5 64 7 53 8 44 C9 36 5 31 11 27 Z"
					/>
					<path
						d="M55 67 C67 62 84 65 86 76 C88 87 73 92 62 89 C53 87 49 79 51 74 C53 70 52 69 55 67 Z"
					/>
					<path
						d="M71 19 C78 14 88 16 89 24 C90 32 83 37 76 35 C70 33 67 25 71 19 Z"
					/>
				</a>
			</svg>
			<span class="sphere" aria-hidden="true"></span>
		</div>
		<button class="back" onclick={() => (zoomed = false)}>← 우주</button>
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

	/* 별 — 순수한 점 */
	.stars {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	.stars span {
		position: absolute;
		border-radius: 50%;
		background: #fff;
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

	/* === 지구 확대: 땅 / 바다 === */
	.world {
		position: absolute;
		left: 50%;
		top: 50%;
		width: min(74vw, 74vh);
		height: min(74vw, 74vh);
		transform: translate(-50%, -50%);
		border-radius: 50%;
		overflow: hidden;
		/* 점이 있던 자리(--sx,--sy)에서 중앙으로 커진다 */
		animation: world-in 820ms cubic-bezier(0.22, 1, 0.36, 1);
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
