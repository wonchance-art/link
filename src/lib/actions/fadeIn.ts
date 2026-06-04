import type { Action } from 'svelte/action';

type Options = { delay?: number } | undefined;

// 스크롤되어 viewport에 들어오면 부드럽게 fade-in.
// prefers-reduced-motion 존중.
export const fadeIn: Action<HTMLElement, Options> = (node, options) => {
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduce) return { destroy() {} };

	const delay = options?.delay ?? 0;

	node.style.opacity = '0';
	node.style.transform = 'translateY(8px)';
	node.style.transition = `opacity 700ms ease-out ${delay}ms, transform 700ms ease-out ${delay}ms`;
	node.style.willChange = 'opacity, transform';

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.style.opacity = '1';
				node.style.transform = 'translateY(0)';
				// transition 끝나면 will-change 해제
				setTimeout(() => {
					node.style.willChange = 'auto';
				}, 700 + delay);
				observer.disconnect();
			}
		},
		{ threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
