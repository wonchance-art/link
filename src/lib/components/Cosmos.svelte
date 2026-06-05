<script lang="ts">
	import { makeStars } from '$lib/cosmos/stars';

	const stars = makeStars(80);

	let zoomed = $state(false);
	let hovered = $state<null | 'sun' | 'earth' | 'moon'>(null);

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
					onclick={() => (zoomed = true)}
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
		<div class="world">
			<a class="sea" href="/sea" aria-label="바다"></a>
			<a class="land land-1" href="/land" aria-label="땅"></a>
			<a class="land land-2" href="/land" aria-hidden="true" tabindex="-1"></a>
			<a class="land land-3" href="/land" aria-hidden="true" tabindex="-1"></a>
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
		animation: world-in 760ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes world-in {
		from {
			transform: translate(-50%, -50%) scale(0.04);
			opacity: 0.4;
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
	/* 땅 = 초록 대륙 (clip-path 실루엣) */
	.land {
		position: absolute;
		background: #6c8b5c;
		cursor: pointer;
		transition: filter 260ms ease;
	}
	.land:hover {
		filter: brightness(1.08);
	}
	.land-1 {
		left: 9%;
		top: 12%;
		width: 47%;
		height: 44%;
		clip-path: polygon(
			22% 6%,
			52% 0%,
			68% 18%,
			62% 38%,
			78% 52%,
			58% 72%,
			40% 64%,
			46% 92%,
			24% 78%,
			14% 48%,
			4% 26%
		);
	}
	.land-2 {
		right: 7%;
		top: 40%;
		width: 38%;
		height: 40%;
		clip-path: polygon(34% 8%, 66% 2%, 88% 30%, 80% 56%, 92% 74%, 54% 90%, 30% 70%, 12% 38%);
	}
	.land-3 {
		left: 30%;
		bottom: 6%;
		width: 26%;
		height: 24%;
		clip-path: polygon(28% 14%, 72% 6%, 90% 46%, 64% 88%, 26% 74%, 8% 42%);
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
