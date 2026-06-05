<script lang="ts">
	// 바람결 — 커서가 다가오면 글자가 무거워지고 들리고 휜다.
	// 평소엔 가늘고 고요(calm), 손대면 빠르게 야성적으로(wild) 반응.
	// 가변 폰트 weight + translateY + rotate를 스프링 보간으로.

	type Props = {
		text: string;
		minWeight?: number;
		maxWeight?: number;
		radius?: number;
		lift?: number;
		bend?: number;
	};
	let {
		text,
		minWeight = 340,
		maxWeight = 840,
		radius = 230,
		lift = 18,
		bend = 11
	}: Props = $props();

	const glyphs = $derived([...text]);

	let charEls: HTMLSpanElement[] = [];
	let raf: number | null = null;
	const pointer = { x: -99999, y: -99999, active: false };

	type S = { w: number; ty: number; rot: number };
	let anim: S[] = [];

	function onMove(e: PointerEvent) {
		pointer.x = e.clientX;
		pointer.y = e.clientY;
		pointer.active = true;
	}
	function onLeave() {
		pointer.active = false;
	}

	function smoothstep(t: number) {
		return t * t * (3 - 2 * t);
	}

	function tick() {
		for (let i = 0; i < charEls.length; i++) {
			const el = charEls[i];
			if (!el) continue;
			if (!anim[i]) anim[i] = { w: minWeight, ty: 0, rot: 0 };

			const r = el.getBoundingClientRect();
			const cx = r.left + r.width / 2;
			const cy = r.top + r.height / 2;
			const dx = pointer.x - cx;
			const dy = pointer.y - cy;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const inf = pointer.active ? smoothstep(Math.max(0, 1 - dist / radius)) : 0;

			const tw = minWeight + inf * (maxWeight - minWeight);
			const tty = -inf * lift;
			const trot = Math.max(-1, Math.min(1, dx / radius)) * inf * -bend;

			const s = anim[i];
			s.w += (tw - s.w) * 0.16;
			s.ty += (tty - s.ty) * 0.16;
			s.rot += (trot - s.rot) * 0.16;

			el.style.fontWeight = String(Math.round(s.w));
			el.style.transform = `translateY(${s.ty.toFixed(2)}px) rotate(${s.rot.toFixed(2)}deg)`;
		}
		raf = requestAnimationFrame(tick);
	}

	$effect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (!window.matchMedia('(pointer: fine)').matches) return;
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerleave', onLeave);
		raf = requestAnimationFrame(tick);
		return () => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerleave', onLeave);
			if (raf) cancelAnimationFrame(raf);
		};
	});
</script>

<span class="wind" aria-label={text}>
	{#each glyphs as g, i (i)}
		<span class="g" class:space={g === ' '} style:--i={i} aria-hidden="true">
			<span class="ink" bind:this={charEls[i]}>{g === ' ' ? ' ' : g}</span>
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
		transform: translateY(34px);
		animation: sprout 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
		animation-delay: calc(var(--i, 0) * 85ms + 120ms);
	}
	.ink {
		display: inline-block;
		font-weight: 340;
		transform-origin: center bottom;
		will-change: transform;
	}
	@keyframes sprout {
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
		.ink {
			font-weight: 460;
		}
	}
</style>
