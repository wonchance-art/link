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
