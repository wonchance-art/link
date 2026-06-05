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

// 은하수 띠를 따라 모여 있는 별들 — "별의 강".
// 대각선 띠(좌하→우상) 축을 따라 작은 별이 밀집해 은하처럼 보이게.
export function makeBandStars(count = 120, seed = 88): Star[] {
	const rng = mulberry32(seed);
	const stars: Star[] = [];
	for (let i = 0; i < count; i++) {
		const x = rng() * 100;
		const baseY = 90 - x * 0.74; // 띠 중심선 (좌하 → 우상)
		// 합으로 근사한 정규분포 → 띠 가까이 밀집
		const spread = (rng() + rng() + rng() - 1.5) * 18;
		const y = baseY + spread;
		// 중심에 가까울수록 밝고 작게
		const near = 1 - Math.min(1, Math.abs(spread) / 27);
		stars.push({
			x,
			y,
			r: 0.3 + rng() * (0.5 + near * 0.7),
			o: 0.16 + near * 0.5 + rng() * 0.18,
			tw: rng() * 6
		});
	}
	return stars;
}
