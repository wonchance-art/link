<script lang="ts">
	import { makeStars } from '$lib/cosmos/stars';

	const stars = makeStars();

	// 'cosmos' = 궤도 씬, 'earth' = 지구 지도(숲/호수)
	let view = $state<'cosmos' | 'earth'>('cosmos');
	// 열린 destination: 'sun' | 'moon' | 'forest' | 'lake' | null
	let dest = $state<null | 'sun' | 'moon' | 'forest' | 'lake'>(null);
	let hovered = $state<null | 'sun' | 'earth' | 'moon'>(null);

	let stageEl: HTMLDivElement | null = $state(null);
	let earthSystemEl: HTMLDivElement | null = $state(null);
	let moonEl: HTMLDivElement | null = $state(null);

	let raf: number | null = null;

	const EARTH_PERIOD = 46000; // ms
	const MOON_PERIOD = 9000;
	const EARTH_R_FRAC = 0.36;
	const MOON_R_FRAC = 0.5; // earth orbit 기준 아니라 earthSystem 내부 px

	function frame(t: number) {
		if (stageEl && earthSystemEl) {
			const w = stageEl.clientWidth;
			const h = stageEl.clientHeight;
			const m = Math.min(w, h);
			const er = m * EARTH_R_FRAC;
			const ang = (t / EARTH_PERIOD) * Math.PI * 2;
			const ex = Math.cos(ang) * er;
			const ey = Math.sin(ang) * er * 0.42; // 타원 궤도 (원근감)
			earthSystemEl.style.transform = `translate(${ex}px, ${ey}px)`;

			if (moonEl) {
				const mr = m * 0.075;
				const mang = (t / MOON_PERIOD) * Math.PI * 2;
				const mx = Math.cos(mang) * mr;
				const my = Math.sin(mang) * mr * 0.5;
				moonEl.style.transform = `translate(${mx}px, ${my}px)`;
				moonEl.style.zIndex = my < 0 ? '1' : '3';
			}
		}
		raf = requestAnimationFrame(frame);
	}

	$effect(() => {
		// 우주 페이지 동안 body를 어둡게 + 스크롤 잠금
		const prevBg = document.body.style.background;
		const prevOf = document.body.style.overflow;
		document.body.style.background = '#06070c';
		document.body.style.overflow = 'hidden';

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!reduce && view === 'cosmos') {
			raf = requestAnimationFrame(frame);
		} else if (earthSystemEl) {
			// 정지 배치
			const m = stageEl ? Math.min(stageEl.clientWidth, stageEl.clientHeight) : 600;
			earthSystemEl.style.transform = `translate(${m * EARTH_R_FRAC * 0.7}px, ${-m * 0.06}px)`;
			if (moonEl) moonEl.style.transform = `translate(${m * 0.07}px, ${-m * 0.03}px)`;
		}

		return () => {
			if (raf) cancelAnimationFrame(raf);
			document.body.style.background = prevBg;
			document.body.style.overflow = prevOf;
		};
	});

	// view 변경 → $effect이 RAF 생명주기를 단독 관리 (이중 실행 방지)
	function openEarth() {
		view = 'earth';
	}
	function backToCosmos() {
		dest = null;
		view = 'cosmos';
	}

	const destMeta = {
		sun: { ko: '태양', en: 'Sun', theme: '이성', sub: '과학 · 이성 · 진리' },
		moon: { ko: '달', en: 'Moon', theme: '감성', sub: '미학 · 인문 · 예술' },
		forest: { ko: '숲', en: 'Forest', theme: '나의 밖', sub: '사람들 사이의 조화' },
		lake: { ko: '호수', en: 'Lake', theme: '나의 안', sub: '내면 · 심연' }
	} as const;

	const fragments = [
		'어떤 문장은 오래 두어야 비로소 자기 빛깔을 낸다.',
		'호수는 깊을수록 고요하다. 안을 들여다보는 일은 늘 조용하다.',
		'사람과 사람 사이, 그 옅은 그늘에서 가장 다정한 말이 자란다.'
	];
</script>

<div class="stage" bind:this={stageEl} class:mapview={view === 'earth'}>
	<!-- 별 -->
	<div class="stars" aria-hidden="true">
		{#each stars as s, i (i)}
			<span
				style:left="{s.x}%"
				style:top="{s.y}%"
				style:width="{s.r}px"
				style:height="{s.r}px"
				style:opacity={s.o}
				style:animation-delay="{s.tw}s"
			></span>
		{/each}
	</div>
	<div class="nebula" aria-hidden="true"></div>

	{#if view === 'cosmos'}
		<div class="system">
			<div class="orbit" aria-hidden="true"></div>

			<!-- 태양 -->
			<button
				class="body sun"
				class:dim={hovered && hovered !== 'sun'}
				onmouseenter={() => (hovered = 'sun')}
				onmouseleave={() => (hovered = null)}
				onclick={() => (dest = 'sun')}
				aria-label="태양 · 이성"
			>
				<span class="glow"></span>
			</button>

			<!-- 지구계 (지구 + 달) -->
			<div class="earth-system" bind:this={earthSystemEl}>
				<button
					class="body earth"
					class:dim={hovered && hovered !== 'earth'}
					onmouseenter={() => (hovered = 'earth')}
					onmouseleave={() => (hovered = null)}
					onclick={openEarth}
					aria-label="지구 · 자기"
				></button>
				<div class="moon-orbit" aria-hidden="true"></div>
				<div class="moon-wrap" bind:this={moonEl}>
					<button
						class="body moon"
						class:dim={hovered && hovered !== 'moon'}
						onmouseenter={() => (hovered = 'moon')}
						onmouseleave={() => (hovered = null)}
						onclick={() => (dest = 'moon')}
						aria-label="달 · 감성"
					></button>
				</div>
			</div>
		</div>

		<!-- 캡션 -->
		<div class="caption" class:show={hovered}>
			{#if hovered === 'sun'}<span><b>태양</b> · 이성 — 과학 · 진리</span>
			{:else if hovered === 'earth'}<span><b>지구</b> · 자기 — 눌러서 들어가기</span>
			{:else if hovered === 'moon'}<span><b>달</b> · 감성 — 미학 · 예술</span>
			{/if}
		</div>

		<div class="hint" aria-hidden="true">태양 · 지구 · 달 — 무엇이든 눌러보세요</div>
		<a class="to-works" href="/works">Wonnit →</a>
	{:else}
		<!-- 지구 지도: 숲 + 호수 -->
		<div class="earth-map">
			<button class="forest" onclick={() => (dest = 'forest')} aria-label="숲 · 나의 밖">
				<span class="map-label">숲<small>나의 밖 · 사회적 조화</small></span>
			</button>
			<button class="lake" onclick={() => (dest = 'lake')} aria-label="호수 · 나의 안">
				<span class="map-label lake-label">호수<small>나의 안 · 내면</small></span>
			</button>
		</div>
		<button class="back" onclick={backToCosmos}>← 우주로</button>
	{/if}

	<!-- destination 패널 -->
	{#if dest}
		<div
			class="panel-wrap"
			role="button"
			tabindex="0"
			onclick={(e) => {
				if (e.target === e.currentTarget) dest = null;
			}}
			onkeydown={(e) => {
				if (e.key === 'Escape') dest = null;
			}}
		>
			<div class="panel" class:lake={dest === 'lake'}>
				<div class="panel-head">
					<span class="p-ko">{destMeta[dest].ko}</span>
					<span class="p-theme">{destMeta[dest].theme}</span>
				</div>
				<p class="p-sub">{destMeta[dest].sub}</p>

				{#if dest === 'lake'}
					<div class="fragments">
						<p class="frag-mark">단상</p>
						{#each fragments as f, i (i)}
							<p class="frag">{f}</p>
						{/each}
					</div>
				{:else}
					<p class="p-soon">곧 채워질 자리.</p>
				{/if}

				<button class="p-close" onclick={() => (dest = null)} aria-label="닫기">닫기</button>
			</div>
		</div>
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
		background:
			radial-gradient(ellipse 60% 50% at 50% 42%, #0c1018 0%, transparent 70%),
			#06070c;
		color: #e9ecf2;
		font-family: var(--font-sans);
		isolation: isolate;
	}

	/* === 별 === */
	.stars {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	.stars span {
		position: absolute;
		border-radius: 50%;
		background: #fff;
		animation: twinkle 5s ease-in-out infinite;
	}
	@keyframes twinkle {
		0%,
		100% {
			opacity: var(--o, 0.4);
			transform: scale(1);
		}
		50% {
			opacity: 0.1;
			transform: scale(0.7);
		}
	}
	.nebula {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse 40% 36% at 28% 70%, rgba(78, 107, 74, 0.14) 0%, transparent 70%),
			radial-gradient(ellipse 36% 32% at 74% 30%, rgba(74, 107, 122, 0.14) 0%, transparent 70%),
			radial-gradient(ellipse 30% 30% at 60% 80%, rgba(142, 137, 174, 0.1) 0%, transparent 70%);
		mix-blend-mode: screen;
	}

	/* === 시스템 === */
	.system {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
	}
	.orbit {
		position: absolute;
		width: 72%;
		height: 30.24%; /* 72% * 0.42 */
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		border: 1px solid rgba(233, 236, 242, 0.1);
		border-radius: 50%;
		max-width: 760px;
		max-height: 320px;
	}

	.body {
		position: absolute;
		border: 0;
		padding: 0;
		background: transparent;
		cursor: pointer;
		border-radius: 50%;
		transition:
			transform 400ms ease,
			opacity 500ms ease;
	}
	.body.dim {
		opacity: 0.4;
	}

	/* 태양 */
	.sun {
		left: 50%;
		top: 50%;
		width: 84px;
		height: 84px;
		margin: -42px 0 0 -42px;
		background: radial-gradient(circle at 38% 36%, #fff4d6 0%, #f4c969 38%, #e8a23e 70%, #c87a25 100%);
		box-shadow:
			0 0 40px 8px rgba(244, 201, 105, 0.5),
			0 0 100px 30px rgba(232, 162, 62, 0.28);
		z-index: 2;
		animation: sun-pulse 6s ease-in-out infinite;
	}
	.sun .glow {
		position: absolute;
		inset: -40px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(244, 201, 105, 0.22) 0%, transparent 65%);
		pointer-events: none;
	}
	@keyframes sun-pulse {
		0%,
		100% {
			box-shadow:
				0 0 40px 8px rgba(244, 201, 105, 0.5),
				0 0 100px 30px rgba(232, 162, 62, 0.28);
		}
		50% {
			box-shadow:
				0 0 52px 12px rgba(244, 201, 105, 0.62),
				0 0 130px 40px rgba(232, 162, 62, 0.34);
		}
	}
	.sun:hover {
		transform: scale(1.06);
	}

	/* 지구계 */
	.earth-system {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 0;
		height: 0;
		z-index: 2;
		will-change: transform;
	}
	.earth {
		left: 0;
		top: 0;
		width: 30px;
		height: 30px;
		margin: -15px 0 0 -15px;
		background:
			radial-gradient(circle at 32% 30%, #9fc3a8 0%, #5f8a68 36%, #3f5340 70%),
			#3f5340;
		box-shadow:
			0 0 14px 2px rgba(95, 138, 104, 0.5),
			inset -4px -4px 8px rgba(0, 0, 0, 0.4),
			inset 3px 3px 6px rgba(180, 210, 200, 0.3);
		z-index: 2;
	}
	.earth::after {
		/* 호수 힌트 */
		content: '';
		position: absolute;
		left: 52%;
		top: 44%;
		width: 36%;
		height: 30%;
		border-radius: 50%;
		background: radial-gradient(circle, #5b86a8 0%, #3d6373 80%);
		opacity: 0.85;
	}
	.earth:hover {
		transform: scale(1.16);
	}
	.moon-orbit {
		position: absolute;
		left: 0;
		top: 0;
		width: 15%;
		height: 7.5%;
		min-width: 120px;
		min-height: 60px;
		transform: translate(-50%, -50%);
		border: 1px solid rgba(233, 236, 242, 0.08);
		border-radius: 50%;
		pointer-events: none;
	}
	.moon-wrap {
		position: absolute;
		left: 0;
		top: 0;
		width: 0;
		height: 0;
		will-change: transform;
	}
	.moon {
		left: 0;
		top: 0;
		width: 12px;
		height: 12px;
		margin: -6px 0 0 -6px;
		background: radial-gradient(circle at 36% 34%, #efeaf6 0%, #c9c3da 45%, #8e89ae 100%);
		box-shadow: 0 0 10px 1px rgba(142, 137, 174, 0.5);
	}
	.moon:hover {
		transform: scale(1.4);
	}

	/* 캡션 */
	.caption {
		position: absolute;
		left: 50%;
		bottom: 88px;
		transform: translateX(-50%);
		font-size: 14px;
		letter-spacing: 0.02em;
		color: rgba(233, 236, 242, 0.78);
		opacity: 0;
		transition: opacity 300ms ease;
		text-align: center;
		pointer-events: none;
	}
	.caption.show {
		opacity: 1;
	}
	.caption b {
		font-weight: 600;
		color: #fff;
	}

	.hint {
		position: absolute;
		left: 50%;
		bottom: 48px;
		transform: translateX(-50%);
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(233, 236, 242, 0.32);
		pointer-events: none;
	}
	.to-works {
		position: absolute;
		top: 32px;
		right: 36px;
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 18px;
		color: rgba(233, 236, 242, 0.66);
		transition: color 240ms ease;
		z-index: 5;
	}
	.to-works:hover {
		color: #f4c969;
	}

	/* === 지구 지도 === */
	.stage.mapview {
		background: radial-gradient(ellipse 80% 80% at 50% 50%, #0c1018 0%, #06070c 100%);
	}
	.earth-map {
		position: absolute;
		left: 50%;
		top: 50%;
		width: min(86vw, 86vh);
		height: min(86vw, 86vh);
		transform: translate(-50%, -50%);
		border-radius: 50%;
		overflow: hidden;
		box-shadow:
			0 0 80px -10px rgba(95, 138, 104, 0.4),
			inset 0 0 120px rgba(0, 0, 0, 0.5);
		animation: earth-in 900ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes earth-in {
		from {
			transform: translate(-50%, -50%) scale(0.2);
			opacity: 0;
		}
		to {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
	}
	.forest {
		position: absolute;
		inset: 0;
		border: 0;
		cursor: pointer;
		background:
			radial-gradient(circle at 30% 28%, #6f9270 0%, transparent 40%),
			radial-gradient(circle at 72% 70%, #4e6b4a 0%, transparent 45%),
			radial-gradient(circle at 50% 50%, #5f7a58 0%, #3f5340 100%);
	}
	.lake {
		position: absolute;
		left: 50%;
		top: 52%;
		width: 42%;
		height: 36%;
		transform: translate(-50%, -50%);
		border: 0;
		border-radius: 50%;
		cursor: pointer;
		background: radial-gradient(circle at 44% 40%, #6a93b0 0%, #3d6373 50%, #1e4252 100%);
		box-shadow:
			0 0 40px -6px rgba(61, 99, 115, 0.7),
			inset 0 6px 18px rgba(255, 255, 255, 0.14),
			inset 0 -8px 20px rgba(0, 0, 0, 0.4);
	}
	.map-label {
		position: absolute;
		left: 24%;
		top: 26%;
		display: flex;
		flex-direction: column;
		gap: 4px;
		color: #f2f6ef;
		font-size: clamp(22px, 3.4vw, 34px);
		font-weight: 600;
		letter-spacing: -0.01em;
		text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
		pointer-events: none;
	}
	.map-label small {
		font-size: 12px;
		font-weight: 400;
		letter-spacing: 0.04em;
		opacity: 0.82;
	}
	.lake-label {
		position: static;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		left: auto;
		top: auto;
	}
	.forest:hover {
		filter: brightness(1.06);
	}
	.lake:hover {
		filter: brightness(1.08);
	}
	.back {
		position: absolute;
		top: 32px;
		left: 36px;
		border: 0;
		background: transparent;
		color: rgba(233, 236, 242, 0.7);
		font-size: 14px;
		cursor: pointer;
		z-index: 5;
		transition: color 200ms ease;
	}
	.back:hover {
		color: #fff;
	}

	/* === destination 패널 === */
	.panel-wrap {
		position: absolute;
		inset: 0;
		z-index: 10;
		display: grid;
		place-items: center;
		padding: 24px;
		background: rgba(6, 7, 12, 0.6);
		backdrop-filter: blur(6px);
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
	.panel {
		width: min(520px, 92vw);
		max-height: 80vh;
		overflow-y: auto;
		background: rgba(18, 22, 30, 0.92);
		border: 1px solid rgba(233, 236, 242, 0.1);
		border-radius: 20px;
		padding: 34px 32px 28px;
		box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.7);
		animation: panel-rise 420ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.panel.lake {
		border-color: rgba(74, 107, 122, 0.4);
	}
	@keyframes panel-rise {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	.panel-head {
		display: flex;
		align-items: baseline;
		gap: 14px;
	}
	.p-ko {
		font-size: 30px;
		font-weight: 600;
		color: #fff;
	}
	.p-theme {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 17px;
		color: #f4c969;
	}
	.panel.lake .p-theme {
		color: #8bb4cc;
	}
	.p-sub {
		font-size: 13px;
		letter-spacing: 0.06em;
		color: rgba(233, 236, 242, 0.6);
		margin: 8px 0 24px;
	}
	.p-soon {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 18px;
		color: rgba(233, 236, 242, 0.5);
		margin: 0 0 24px;
	}
	.fragments {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 24px;
	}
	.frag-mark {
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #8bb4cc;
		margin: 0;
	}
	.frag {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 18px;
		line-height: 1.5;
		color: #e9ecf2;
		margin: 0;
		padding-left: 14px;
		border-left: 2px solid rgba(74, 107, 122, 0.5);
	}
	.p-close {
		border: 1px solid rgba(233, 236, 242, 0.18);
		background: transparent;
		color: rgba(233, 236, 242, 0.8);
		border-radius: 999px;
		padding: 8px 20px;
		font-size: 13px;
		cursor: pointer;
		transition:
			background 200ms ease,
			color 200ms ease;
	}
	.p-close:hover {
		background: rgba(233, 236, 242, 0.1);
		color: #fff;
	}

	@media (max-width: 640px) {
		.sun {
			width: 64px;
			height: 64px;
			margin: -32px 0 0 -32px;
		}
		.to-works {
			top: 24px;
			right: 22px;
			font-size: 16px;
		}
		.back {
			top: 24px;
			left: 22px;
		}
		.hint {
			font-size: 10px;
			bottom: 34px;
			padding: 0 24px;
			text-align: center;
		}
	}
</style>
