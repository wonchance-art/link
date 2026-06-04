<script lang="ts">
	import type { Work } from '$lib/content/works';
	import { tilt3d } from '$lib/actions/tilt3d';

	type Props = { items: Work[] };
	let { items }: Props = $props();
</script>

{#snippet body(work: Work)}
	<div class="row">
		<span class="title">{work.title}</span>
		<span class="trail">
			{#if work.date}<span class="date">{work.date}</span>{/if}
			{#if work.href}<span class="arrow">→</span>{/if}
		</span>
	</div>
	{#if work.description}
		<p class="desc">{work.description}</p>
	{/if}
{/snippet}

<section class="sect">
	<h2 class="sect-title">Works</h2>
	<ul class="works">
		{#each items as work (work.title + (work.href ?? ''))}
			<li>
				{#if work.href}
					<a href={work.href} use:tilt3d>{@render body(work)}</a>
				{:else}
					<div class="card pending">{@render body(work)}</div>
				{/if}
			</li>
		{/each}
	</ul>
</section>

<style>
	.works {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 10px;
		perspective: 1000px;
	}
	.works li > a,
	.works li > .card {
		display: block;
		background: rgba(251, 250, 246, 0.55);
		backdrop-filter: blur(14px) saturate(150%);
		-webkit-backdrop-filter: blur(14px) saturate(150%);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 18px 20px 18px 22px;
		color: var(--ink);
		transform-style: preserve-3d;
		--hover-y: 0px;
		transform: rotateX(var(--ty-deg, 0deg)) rotateY(var(--tx-deg, 0deg))
			translateY(var(--hover-y));
		box-shadow:
			inset 1px 0 0 var(--accent),
			inset 0 1px 0 rgba(255, 255, 255, 0.5),
			0 4px 14px -6px rgba(78, 107, 74, 0.1);
		transition:
			transform 420ms cubic-bezier(0.34, 1.35, 0.64, 1),
			border-color 220ms ease,
			box-shadow 360ms ease,
			background 280ms ease;
	}
	.works li > a:hover {
		--hover-y: -2px;
		background: rgba(251, 250, 246, 0.82);
		border-color: var(--accent-soft);
		box-shadow:
			inset 2px 0 0 var(--accent),
			inset 0 1px 0 rgba(255, 255, 255, 0.6),
			0 22px 44px -16px var(--accent-soft),
			0 4px 8px rgba(31, 42, 42, 0.05);
	}
	/* 탭/터치 시 미세 눌림 — 모바일 feedback */
	.works li > a:active {
		--hover-y: 0px;
		--tx-deg: 0deg;
		--ty-deg: 0deg;
		transform: scale(0.985);
		transition: transform 140ms ease;
	}
	.works li > .pending {
		opacity: 0.65;
		cursor: default;
		box-shadow:
			inset 1px 0 0 var(--line),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}
	.row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}
	.row:not(:only-child) {
		margin-bottom: 6px;
	}
	.title {
		font-size: 16px;
		font-weight: 600;
		color: var(--ink);
		transition: color 320ms ease;
	}
	.trail {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--ink-faint);
	}
	.date {
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		white-space: nowrap;
		transition: color 320ms ease 60ms;
	}
	.arrow {
		color: var(--ink-faint);
		transition:
			transform 420ms cubic-bezier(0.34, 1.35, 0.64, 1) 140ms,
			color 320ms ease 140ms;
	}
	.works li > a:hover .title {
		color: var(--accent-deep);
	}
	.works li > a:hover .date {
		color: var(--ink-muted);
	}
	.works li > a:hover .arrow {
		color: var(--accent);
		transform: translateX(4px);
	}
	.desc {
		font-size: 14px;
		color: var(--ink-muted);
		line-height: 1.6;
		margin: 0;
	}
</style>
