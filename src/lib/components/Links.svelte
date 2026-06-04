<script lang="ts">
	import type { Link } from '$lib/content/links';
	import { tilt3d } from '$lib/actions/tilt3d';

	type Props = { items: Link[] };
	let { items }: Props = $props();
</script>

<section class="sect">
	<h2 class="sect-title">Elsewhere</h2>
	<ul class="links">
		{#each items as link (link.label)}
			<li>
				<a href={link.href} use:tilt3d>
					<span class="label">{link.label}</span>
					{#if link.meta}<span class="meta">{link.meta}</span>{/if}
					<span class="arrow">→</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 10px;
		perspective: 1000px;
	}
	.links a {
		display: flex;
		align-items: center;
		background: rgba(251, 250, 246, 0.55);
		backdrop-filter: blur(14px) saturate(150%);
		-webkit-backdrop-filter: blur(14px) saturate(150%);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 16px 18px 16px 20px;
		color: var(--ink);
		font-size: 15px;
		font-weight: 500;
		transform-style: preserve-3d;
		--hover-y: 0px;
		transform: rotateX(var(--ty-deg, 0deg)) rotateY(var(--tx-deg, 0deg))
			translateY(var(--hover-y));
		/* 좌측 pond strip + 상단 광택 + 부드러운 그림자 */
		box-shadow:
			inset 1px 0 0 var(--accent-pond),
			inset 0 1px 0 rgba(255, 255, 255, 0.5),
			0 4px 14px -6px rgba(74, 107, 122, 0.1);
		transition:
			transform 420ms cubic-bezier(0.34, 1.35, 0.64, 1),
			border-color 220ms ease,
			box-shadow 360ms ease,
			background 280ms ease;
	}
	.links a:hover {
		--hover-y: -2px;
		background: rgba(251, 250, 246, 0.82);
		border-color: var(--accent-soft);
		box-shadow:
			inset 2px 0 0 var(--accent-pond),
			inset 0 1px 0 rgba(255, 255, 255, 0.6),
			0 22px 44px -16px rgba(74, 107, 122, 0.28),
			0 4px 8px rgba(31, 42, 42, 0.05);
	}
	/* 탭/터치 시 미세 눌림 — 모바일 feedback */
	.links a:active {
		--hover-y: 0px;
		--tx-deg: 0deg;
		--ty-deg: 0deg;
		transform: scale(0.985);
		transition: transform 140ms ease;
	}
	.label {
		flex: 0 0 auto;
	}
	.meta {
		font-size: 12px;
		color: var(--ink-faint);
		font-weight: 400;
		margin-left: auto;
		margin-right: 16px;
		transition: color 280ms ease 40ms;
	}
	a:not(:has(.meta)) .arrow {
		margin-left: auto;
	}
	.arrow {
		color: var(--ink-faint);
		transition:
			transform 420ms cubic-bezier(0.34, 1.35, 0.64, 1) 100ms,
			color 320ms ease 100ms;
	}
	a:hover .meta {
		color: var(--ink-muted);
	}
	a:hover .arrow {
		color: var(--accent-pond);
		transform: translateX(4px);
	}
</style>
