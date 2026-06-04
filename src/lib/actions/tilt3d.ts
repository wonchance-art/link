import type { Action } from 'svelte/action';

// 마우스 위치 기반 미세 3D tilt.
// 카드를 호버하면 마우스 위치 쪽으로 살짝 기울어진다.
// pointer:fine 환경에서만, prefers-reduced-motion 존중.

type Options = { max?: number } | undefined;

export const tilt3d: Action<HTMLElement, Options> = (node, opts) => {
	if (typeof window === 'undefined') return;
	if (window.matchMedia('(pointer: coarse)').matches) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const maxDeg = opts?.max ?? 3;
	let rafId: number | null = null;

	function onMove(e: PointerEvent) {
		if (rafId !== null) return;
		rafId = requestAnimationFrame(() => {
			rafId = null;
			const rect = node.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width;
			const y = (e.clientY - rect.top) / rect.height;
			const ry = (x - 0.5) * 2 * maxDeg; // 좌우 → Y축 회전
			const rx = (0.5 - y) * 2 * maxDeg; // 상하 → X축 회전
			node.style.setProperty('--ty-deg', `${rx}deg`);
			node.style.setProperty('--tx-deg', `${ry}deg`);
		});
	}

	function onLeave() {
		node.style.setProperty('--ty-deg', '0deg');
		node.style.setProperty('--tx-deg', '0deg');
	}

	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerleave', onLeave);

	return {
		destroy() {
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerleave', onLeave);
			if (rafId !== null) cancelAnimationFrame(rafId);
		}
	};
};
