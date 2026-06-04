// 스크롤 진행률(0~1)을 --scroll-progress 변수로 documentElement에 주입.
// body 배경 그라데이션이 이 변수를 calc()로 받아 미세 패럴랙스 효과.

export function scrollProgress() {
	if (typeof window === 'undefined') return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	let rafId: number | null = null;

	function update() {
		if (rafId !== null) return;
		rafId = requestAnimationFrame(() => {
			rafId = null;
			const scrollY = window.scrollY;
			const max = document.documentElement.scrollHeight - window.innerHeight;
			const t = max > 0 ? Math.max(0, Math.min(1, scrollY / max)) : 0;
			document.documentElement.style.setProperty('--scroll-progress', t.toString());
		});
	}

	window.addEventListener('scroll', update, { passive: true });
	update();

	return () => {
		window.removeEventListener('scroll', update);
		if (rafId !== null) cancelAnimationFrame(rafId);
	};
}
