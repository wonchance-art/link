// SSR/CSR 동일하게 생성되도록 시드 고정 PRNG (hydration mismatch 방지)
function mulberry32(seed: number) {
	return function () {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export type Star = { x: number; y: number; r: number; o: number; tw: number };

export function makeStars(count = 90, seed = 20260606): Star[] {
	const rng = mulberry32(seed);
	const stars: Star[] = [];
	for (let i = 0; i < count; i++) {
		stars.push({
			x: rng() * 100,
			y: rng() * 100,
			r: 0.4 + rng() * 1.3,
			o: 0.18 + rng() * 0.62,
			tw: rng() * 6
		});
	}
	return stars;
}

// 은하수 아치 중심선 — 화면에 표시되는 NASA 은하수 띠(아치)와 맞춤.
// 좌우로 갈수록 내려가는 포물선 아치. (x: 0~100 → y %)
export function galaxyArchY(x: number): number {
	return 50 - 0.84 * (x - 50);
}

// 은하수 아치를 따라 모여 있는 별들 — "별의 강".
export function makeBandStars(count = 130, seed = 88): Star[] {
	const rng = mulberry32(seed);
	const stars: Star[] = [];
	for (let i = 0; i < count; i++) {
		const x = rng() * 100;
		const baseY = galaxyArchY(x); // 아치 곡선
		// 합으로 근사한 정규분포 → 띠 가까이 밀집
		const spread = (rng() + rng() + rng() - 1.5) * 13;
		const y = baseY + spread;
		const near = 1 - Math.min(1, Math.abs(spread) / 20);
		stars.push({
			x,
			y,
			r: 0.3 + rng() * (0.45 + near * 0.65),
			o: 0.14 + near * 0.5 + rng() * 0.16,
			tw: rng() * 6
		});
	}
	return stars;
}
