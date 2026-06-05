<script lang="ts">
	import type { Work } from '$lib/content/works';
	import type { Lang } from '$lib/i18n/lang';
	import { tilt3d } from '$lib/actions/tilt3d';

	type Props = { items: Work[]; lang: Lang };
	let { items, lang }: Props = $props();

	const main = $derived(lang === 'ko' ? '작업' : 'Works');
	const sub = $derived(lang === 'ko' ? 'Works' : '작업');
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
	<h2 class="sect-title">
		{main}
		<span class="sub">{sub}</span>
	</h2>
	<ul class="works">
		{#each items as work, i (work.title + (work.href ?? ''))}
			<li class:featured={i === 0}>
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
		gap: 12px;
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
		padding: 22px 24px 24px 26px;
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
	/* Featured (첫 번째) — 잡지 헤드라인 카드 */
	.works li.featured > a,
	.works li.featured > .card {
		padding: 30px 30px 32px 32px;
		background: rgba(251, 250, 246, 0.7);
		box-shadow:
			inset 2px 0 0 var(--accent),
			inset 0 1px 0 rgba(255, 255, 255, 0.55),
			0 8px 22px -10px rgba(78, 107, 74, 0.14);
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
	.works li.featured > a:hover {
		box-shadow:
			inset 3px 0 0 var(--accent),
			inset 0 1px 0 rgba(255, 255, 255, 0.65),
			0 26px 50px -18px var(--accent-soft),
			0 6px 12px rgba(31, 42, 42, 0.06);
	}
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
	.works li.featured > .pending {
		box-shadow:
			inset 2px 0 0 var(--line),
			inset 0 1px 0 rgba(255, 255, 255, 0.45);
	}
	.row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}
	.row:not(:only-child) {
		margin-bottom: 8px;
	}
	.title {
		font-size: 18px;
		font-weight: 600;
		letter-spacing: -0.012em;
		color: var(--ink);
		transition: color 320ms ease;
	}
	.featured .title {
		font-size: 22px;
		letter-spacing: -0.018em;
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
		font-size: 15px;
		color: var(--ink-muted);
		line-height: 1.65;
		margin: 0;
	}
	.featured .desc {
		font-size: 16px;
	}
</style>
