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

// 은하 프레임(은하수 이미지와 같은 회전 transform) 안의 좌표.
// 가로 중심선 y=50 = 은하수 띠. 별을 그 둘레에 두면 프레임 회전 시
// 은하수와 정확히 겹친다 (화면 비율과 무관).
export function makeBandStars(count = 150, seed = 88): Star[] {
	const rng = mulberry32(seed);
	const stars: Star[] = [];
	for (let i = 0; i < count; i++) {
		const x = rng() * 100;
		const spread = (rng() + rng() + rng() - 1.5) * 18;
		const y = 50 + spread;
		const near = 1 - Math.min(1, Math.abs(spread) / 27);
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
