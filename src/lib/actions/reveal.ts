import type { Action } from 'svelte/action';

// 뷰포트에 들어오면 data-revealed 부여 → 큰 타이포가 아래에서 위로 드러난다.
// clip-path 마스크 와이프. prefers-reduced-motion 존중.
export const reveal: Action<HTMLElement> = (node) => {
	if (typeof IntersectionObserver === 'undefined') {
		node.setAttribute('data-revealed', '');
		return;
	}
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.setAttribute('data-revealed', '');
		return;
	}

	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					node.setAttribute('data-revealed', '');
					io.disconnect();
					break;
				}
			}
		},
		{ threshold: 0.25, rootMargin: '0px 0px -8% 0px' }
	);
	io.observe(node);

	return {
		destroy() {
			io.disconnect();
		}
	};
};
