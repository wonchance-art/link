<script lang="ts">
	// 격을 지키는 미세 반응 — 커서가 다가오면 글자의 '두께'만 은은히 변한다.
	// 회전·들림 없음. 잉크가 번지듯, 움직이지 않고 무게만 따라온다.

	type Props = {
		text: string;
		minWeight?: number;
		maxWeight?: number;
		radius?: number;
	};
	let { text, minWeight = 400, maxWeight = 600, radius = 300 }: Props = $props();

	const glyphs = $derived([...text]);

	let charEls: HTMLSpanElement[] = [];
	let raf: number | null = null;
	let running = false;
	const pointer = { x: -99999, y: -99999, active: false };
	let w: number[] = [];

	function start() {
		if (running) return;
		running = true;
		raf = requestAnimationFrame(tick);
	}
	function onMove(e: PointerEvent) {
		pointer.x = e.clientX;
		pointer.y = e.clientY;
		pointer.active = true;
		start();
	}
	function onLeave() {
		pointer.active = false;
		start(); // 쉬는 상태로 부드럽게 되돌아가도록 한 번 더 돌린다
	}
	function smoothstep(t: number) {
		return t * t * (3 - 2 * t);
	}

	function tick() {
		let moving = false;
		for (let i = 0; i < charEls.length; i++) {
			const el = charEls[i];
			if (!el) continue;
			if (w[i] === undefined) w[i] = minWeight;
			const r = el.getBoundingClientRect();
			const cx = r.left + r.width / 2;
			const cy = r.top + r.height / 2;
			const dist = Math.sqrt((pointer.x - cx) ** 2 + (pointer.y - cy) ** 2);
			const inf = pointer.active ? smoothstep(Math.max(0, 1 - dist / radius)) : 0;
			const target = minWeight + inf * (maxWeight - minWeight);
			const next = w[i] + (target - w[i]) * 0.1;
			if (Math.abs(next - w[i]) > 0.05) moving = true;
			w[i] = next;
			el.style.fontWeight = String(Math.round(w[i]));
		}
		// 커서가 떠났고 모두 쉬는 두께로 안정되면 루프 정지 (idle 시 CPU 0)
		if (pointer.active || moving) {
			raf = requestAnimationFrame(tick);
		} else {
			running = false;
			raf = null;
		}
	}

	$effect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (!window.matchMedia('(pointer: fine)').matches) return;
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerleave', onLeave);
		return () => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerleave', onLeave);
			if (raf) cancelAnimationFrame(raf);
			running = false;
		};
	});
</script>

<span class="wind" aria-label={text}>
	{#each glyphs as g, i (i)}
		<span class="g" class:space={g === ' '} style:--i={i} aria-hidden="true">
			<span class="ink" bind:this={charEls[i]}>{g === ' ' ? ' ' : g}</span>
		</span>
	{/each}
</span>

<style>
	.wind {
		display: inline;
	}
	.g {
		display: inline-block;
		opacity: 0;
		transform: translateY(22px);
		animation: rise 980ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
		animation-delay: calc(var(--i, 0) * 78ms + 140ms);
	}
	.ink {
		display: inline-block;
		font-weight: 400;
		will-change: font-weight;
	}
	@keyframes rise {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.g {
			opacity: 1;
			transform: none;
			animation: none;
		}
	}
</style>
