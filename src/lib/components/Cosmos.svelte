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
	const ORBIT_TILT = 0.52; // 황도면을 비스듬히 본 y축 압축(지구·행성 공용)

	type Planet = {
		key: string;
		distFrac: number; // 시각 거리(m 기준). 실제 AU의 ≈a^0.45 압축
		e: number;        // 이심률 (J2000.0)
		T: number;        // 공전주기 (지구년)
		peri: number;     // 근점경도 ϖ (rad)
		phase0: number;   // 초기 평균근점이각 — 시각 분산용
		size: number;
		color: string;
		cls: '' | 'jupiter' | 'saturn';
		name: string;
		symbol?: string;  // 상징 (그리스어) — 있으면 클릭 가능
		essence?: string; // 상징의 의미 한 줄
	};
	const PLANETS: Planet[] = [
		{ key: 'mercury', distFrac: 0.09, e: 0.206, T: 0.241, peri: 1.34, phase0: 1.0, size: 5,  color: '#cdbfa6', cls: '',        name: '수성' },
		{ key: 'venus',   distFrac: 0.21, e: 0.007, T: 0.615, peri: 2.29, phase0: 2.1, size: 8,  color: '#f0e7d2', cls: '',        name: '금성', symbol: 'Eros',    essence: '끌림. 어떤 것을 향해 마음이 기우는 일.' },
		{ key: 'mars',    distFrac: 0.42, e: 0.093, T: 1.881, peri: 5.86, phase0: 3.3, size: 5,  color: '#d2502c', cls: '',        name: '화성', symbol: 'Thymos',  essence: '기개. 나를 앞으로 밀어붙이는 의지.' },
		{ key: 'jupiter', distFrac: 0.56, e: 0.048, T: 11.86, peri: 0.24, phase0: 4.4, size: 17, color: '#d6b07a', cls: 'jupiter', name: '목성', symbol: 'Nomos',   essence: '질서. 흩어지려는 것들을 붙드는 법.' },
		{ key: 'saturn',  distFrac: 0.70, e: 0.054, T: 29.46, peri: 1.62, phase0: 5.5, size: 14, color: '#e8d6a4', cls: 'saturn',  name: '토성', symbol: 'Chronos', essence: '시간. 쌓이고 잊히고, 그래도 남는 자리.' }
	];
	let planetEls: (HTMLDivElement | null)[] = $state(Array(PLANETS.length).fill(null));
	// 점 크기 반응형 — 큰 화면은 px 유지, 작은 화면(모바일)은 비례 축소
	const dsize = (px: number) =>
		`clamp(${(px * 0.6).toFixed(1)}px, ${(px / 7.5).toFixed(2)}vmin, ${px}px)`;
	let openedPlanet = $state<Planet | null>(null);
	let hoveredPlanet = $state<string | null>(null);

	function keplerXY(t: number, p: Planet) {
		const M = (t / (p.T * EARTH_PERIOD)) * Math.PI * 2 + p.phase0;
		let E = M;
		for (let i = 0; i < 4; i++) E -= (E - p.e * Math.sin(E) - M) / (1 - p.e * Math.cos(E));
		const X = Math.cos(E) - p.e;
		const Y = Math.sqrt(1 - p.e * p.e) * Math.sin(E);
		const c = Math.cos(p.peri);
		const s = Math.sin(p.peri);
		return { x: X * c - Y * s, y: X * s + Y * c };
	}

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
		if (stageEl) {
			const m = Math.min(stageEl.clientWidth, stageEl.clientHeight);
			if (earthSystemEl) {
				const er = m * EARTH_R_FRAC;
				const a = (t / EARTH_PERIOD) * Math.PI * 2;
				earthSystemEl.style.transform = `translate(${Math.cos(a) * er}px, ${-Math.sin(a) * er * ORBIT_TILT}px)`;
				if (moonEl) {
					const mr = m * 0.05;
					const ma = (t / MOON_PERIOD) * Math.PI * 2;
					const my = -Math.sin(ma) * mr * 0.5;
					moonEl.style.transform = `translate(${Math.cos(ma) * mr}px, ${my}px)`;
					moonEl.style.zIndex = my < 0 ? '1' : '4';
				}
			}
			for (let i = 0; i < PLANETS.length; i++) {
				const p = PLANETS[i];
				const el = planetEls[i];
				if (!el) continue;
				const r = m * p.distFrac;
				const { x, y } = keplerXY(t, p);
				el.style.transform = `translate(${x * r}px, ${-y * r * ORBIT_TILT}px)`;
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
			if (moonEl) moonEl.style.transform = `translate(${m * 0.046}px, ${-m * 0.015}px)`;
			for (let i = 0; i < PLANETS.length; i++) {
				const p = PLANETS[i];
				const el = planetEls[i];
				if (!el) continue;
				const r = m * p.distFrac;
				const { x, y } = keplerXY(0, p);
				el.style.transform = `translate(${x * r}px, ${-y * r * ORBIT_TILT}px)`;
			}
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
	<!-- 은하 띠 별: 은하수와 같은 회전 프레임 → 화면 비율 무관하게 정확히 정렬 -->
	<div class="galaxy-frame band-stars" aria-hidden="true">
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
	</div>
	<div class="stars" aria-hidden="true">
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
		<div class="galaxy-frame gstars">
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

			<!-- 행성: 수성·금성·화성·목성·토성 (실측 이심률·근점방향·주기) -->
			{#each PLANETS as p, i (p.key)}
				<div class="planet-wrap" bind:this={planetEls[i]} aria-label={p.name}>
					<span class="planet-dot {p.cls}" style:--c={p.color} style:--s={dsize(p.size)}></span>
					{#if p.symbol}
						<button
							class="planet-hit"
							onmouseenter={() => (hoveredPlanet = p.key)}
							onmouseleave={() => (hoveredPlanet = null)}
							onclick={() => (openedPlanet = p)}
							aria-label="{p.name} · {p.symbol}"
						></button>
						<span class="planet-name" class:show={hoveredPlanet === p.key}>{p.symbol}</span>
					{/if}
				</div>
			{/each}

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

		<!-- 별을 누르면 그 글이 뜬다 -->
		{#if openedStar}
			<button class="star-backdrop" onclick={() => (openedStar = null)} aria-label="닫기"></button>
			<div class="star-card">
				<p class="sc-name">{openedStar.name}</p>
				<p class="sc-note">{openedStar.note}</p>
				<button class="sc-close" onclick={() => (openedStar = null)}>닫기</button>
			</div>
		{/if}

		<!-- 행성을 누르면 그 상징이 뜬다 -->
		{#if openedPlanet}
			<button class="star-backdrop" onclick={() => (openedPlanet = null)} aria-label="닫기"></button>
			<div class="star-card planet-card">
				<span class="pc-dot {openedPlanet.cls}" style:--c={openedPlanet.color}></span>
				<p class="sc-name">{openedPlanet.name} · {openedPlanet.symbol}</p>
				<p class="sc-note">{openedPlanet.essence}</p>
				<button class="sc-close" onclick={() => (openedPlanet = null)}>닫기</button>
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
		background: #000;
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
		filter: sepia(0.5) hue-rotate(205deg) saturate(1.5) brightness(0.72) contrast(1.02);
		opacity: 0.22;
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

	/* 은하 프레임 — 은하수 이미지와 동일한 회전. 안의 별이 은하수와 정확히 정렬 */
	.galaxy-frame {
		position: absolute;
		left: -42%;
		right: -42%;
		top: 18%;
		height: 64%;
		transform: rotate(-40deg);
		transform-origin: center;
		pointer-events: none;
	}
	.band-stars span {
		position: absolute;
		border-radius: 50%;
		background: #fff;
		opacity: var(--o, 0.5);
		animation: twinkle 6s ease-in-out infinite;
	}
	@media (prefers-reduced-motion: reduce) {
		.band-stars span {
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
		width: clamp(12px, 2.67vmin, 20px);
		height: clamp(12px, 2.67vmin, 20px);
		background: #f5cd2e;
		box-shadow: 0 0 12px 2px rgba(245, 205, 46, 0.35);
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
		width: clamp(5.4px, 1.2vmin, 9px);
		height: clamp(5.4px, 1.2vmin, 9px);
		/* 대륙(초록) + 바다(파랑) — 확대 뷰의 land/sea 색과 연결 */
		background: radial-gradient(circle at 38% 38%, #6faa6e 0%, #6faa6e 34%, #4f86ab 60%, #4a7ba0 100%);
		box-shadow: 0 0 6px 1px rgba(160, 200, 220, 0.25);
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

	/* 행성들 (수성·금성·화성·목성·토성) */
	.planet-wrap {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 0;
		height: 0;
		z-index: 2;
		will-change: transform;
		pointer-events: none;
	}
	.planet-dot {
		position: absolute;
		left: 0;
		top: 0;
		width: var(--s);
		height: var(--s);
		margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
		border-radius: 50%;
		background: var(--c);
		/* 음영(구체감) + 옅은 외광 → 은하수 띠 위에서도 떠 보임 */
		box-shadow:
			inset -1px -1px 2px rgba(0, 0, 0, 0.35),
			0 0 8px 1px rgba(255, 255, 255, 0.22);
	}
	.planet-dot.jupiter {
		background: linear-gradient(
			to bottom,
			#e2c48e 0%,
			#e2c48e 22%,
			#9a6a3e 31%,
			#e0bd86 41%,
			#b07a4a 51%,
			#e2c48e 61%,
			#9a6a3e 71%,
			#e0bd86 81%,
			#b07a4a 91%,
			#e2c48e 100%
		);
	}
	.planet-dot.saturn {
		background: #e4cc9c;
		overflow: visible;
	}
	.planet-dot.saturn::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 320%;
		height: 110%;
		transform: translate(-50%, -50%) rotate(-18deg);
		border-radius: 50%;
		border: 1.2px solid rgba(214, 184, 130, 0.85);
		pointer-events: none;
	}
	/* 행성 클릭 히트영역(투명) — 점이 작아도 누르기 쉽게 */
	.planet-hit {
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(-50%, -50%);
		width: 30px;
		height: 30px;
		border: 0;
		padding: 0;
		background: transparent;
		cursor: pointer;
		pointer-events: auto;
		z-index: 5;
	}
	/* 호버 시 상징(그리스어) 라벨 — 점 아래 */
	.planet-name {
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(-50%, 13px);
		white-space: nowrap;
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 13px;
		letter-spacing: 0.06em;
		color: rgba(233, 236, 242, 0.92);
		opacity: 0;
		transition: opacity 240ms ease;
		pointer-events: none;
		text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
	}
	.planet-name.show {
		opacity: 1;
	}
	/* 상징 카드의 행성 색 점 */
	.pc-dot {
		display: block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--c);
		margin: 0 0 16px;
		box-shadow: 0 0 12px rgba(255, 255, 255, 0.22);
	}
	.pc-dot.jupiter {
		background: linear-gradient(to bottom, #e2c48e, #9a6a3e, #e0bd86, #b07a4a, #e2c48e);
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
		z-index: 2;
	}
	.gstar {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 30px;
		height: 30px;
		display: grid;
		place-items: center;
		border: 0;
		background: transparent;
		padding: 0;
		cursor: pointer;
		pointer-events: auto;
	}
	.g-dot {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: #eaf0ff;
		transition: transform 300ms ease;
	}
	.gstar:hover .g-dot,
	.gstar.active .g-dot {
		transform: scale(2);
	}
	.g-name {
		position: absolute;
		top: 100%;
		left: 50%;
		/* 프레임이 -40도 회전하므로 +40도로 라벨을 바로 세움 */
		transform: translate(-50%, 4px) rotate(40deg);
		transform-origin: top center;
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
		background: #2a1500;
	}
	.sun-surface {
		position: absolute;
		inset: 0;
		background: url('/sun.jpg') 0 center / 200% 100% repeat-x;
		animation: surf 42s linear infinite;
	}
	.sun-sphere {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		pointer-events: none;
		background: radial-gradient(
			circle at 42% 40%,
			transparent 48%,
			rgba(110, 45, 0, 0.32) 80%,
			rgba(70, 25, 0, 0.5) 100%
		);
		box-shadow:
			inset -18px -20px 50px rgba(90, 35, 0, 0.42),
			inset 14px 16px 44px rgba(255, 244, 190, 0.16);
	}
	/* 달 표면 (자전 스크롤) */
	.moon-orb {
		background: #15151a;
	}
	.moon-surface {
		position: absolute;
		inset: 0;
		background: url('/moon.jpg') 0 center / 200% 100% repeat-x;
		animation: surf 72s linear infinite;
	}
	@keyframes surf {
		to {
			background-position-x: -200%;
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
		background: radial-gradient(
			circle at 38% 34%,
			transparent 42%,
			rgba(0, 0, 0, 0.32) 76%,
			rgba(0, 0, 0, 0.6) 100%
		);
		box-shadow:
			inset -22px -26px 60px rgba(0, 0, 0, 0.5),
			inset 14px 16px 44px rgba(255, 255, 255, 0.07);
	}

</style>
