<script lang="ts">
	import type { Work } from '$lib/content/works';

	type Props = { items: Work[] };
	let { items }: Props = $props();
</script>

<div class="works">
	{#each items as work, i (work.title + (work.href ?? i))}
		{#if work.href}
			<a class="work" href={work.href} target="_blank" rel="noopener noreferrer">
				<span class="num">{String(i + 1).padStart(2, '0')}</span>
				<span class="main">
					<span class="head">
						<h3 class="title">{work.title}</h3>
						<span class="go" aria-hidden="true">→</span>
					</span>
					{#if work.description}<p class="desc">{work.description}</p>{/if}
				</span>
				<span class="vine" aria-hidden="true"></span>
			</a>
		{:else}
			<div class="work pending">
				<span class="num">{String(i + 1).padStart(2, '0')}</span>
				<span class="main">
					<span class="head">
						<h3 class="title">{work.title}</h3>
						{#if work.date}<span class="tag">{work.date}</span>{/if}
					</span>
					{#if work.description}<p class="desc">{work.description}</p>{/if}
				</span>
			</div>
		{/if}
	{/each}
</div>

<style>
	.works {
		display: flex;
		flex-direction: column;
	}
	.work {
		position: relative;
		display: grid;
		grid-template-columns: 38px 1fr;
		column-gap: 18px;
		align-items: start;
		padding: 26px 0 28px;
		color: var(--ink);
		border-top: 1px solid var(--line);
	}
	.work:first-child {
		border-top: 0;
	}
	.num {
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.1em;
		color: var(--ink-faint);
		padding-top: 0.7em;
		transition: color 320ms ease;
	}
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
	}
	.title {
		font-family: var(--font-sans);
		font-size: clamp(28px, 6vw, 54px);
		font-weight: 400;
		line-height: 1.02;
		letter-spacing: -0.035em;
		color: var(--ink);
		margin: 0;
		transition:
			font-weight 360ms cubic-bezier(0.22, 1, 0.36, 1),
			letter-spacing 360ms ease,
			color 320ms ease;
	}
	.go {
		font-size: clamp(20px, 3vw, 30px);
		color: var(--ink-faint);
		flex: 0 0 auto;
		transition:
			transform 420ms cubic-bezier(0.34, 1.35, 0.64, 1),
			color 320ms ease;
	}
	.desc {
		font-size: 15px;
		color: var(--ink-muted);
		line-height: 1.6;
		margin: 12px 0 0;
		max-width: 460px;
	}
	.tag {
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
		white-space: nowrap;
		flex: 0 0 auto;
		padding-top: 0.5em;
	}

	/* 덩굴 밑줄 — 호버 시 왼쪽에서 자라남 */
	.vine {
		position: absolute;
		left: 0;
		bottom: 14px;
		height: 2px;
		width: 0;
		background: linear-gradient(90deg, var(--accent), var(--accent-pond));
		transition: width 520ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.work:hover .vine {
		width: 100%;
	}
	.work:hover .title {
		font-weight: 680;
		letter-spacing: -0.042em;
		color: var(--accent-deep);
	}
	.work:hover .num {
		color: var(--accent);
	}
	.work:hover .go {
		color: var(--accent);
		transform: translate(5px, -3px);
	}

	.pending {
		opacity: 0.66;
	}
	.pending .title {
		color: var(--ink-muted);
	}
</style>
