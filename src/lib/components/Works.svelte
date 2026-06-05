<script lang="ts">
	import type { Work } from '$lib/content/works';
	import { reveal } from '$lib/actions/reveal';

	type Props = { items: Work[] };
	let { items }: Props = $props();

	const nn = (i: number) => String(i + 1).padStart(2, '0');
</script>

{#snippet inner(work: Work, i: number)}
	<span class="topline">
		<span class="num">{nn(i)}</span>
		<span class="rule" aria-hidden="true"></span>
		{#if work.date}<span class="status">{work.date}</span>{/if}
	</span>
	<h3 class="title">
		<span class="t">{work.title}</span>{#if work.href}<span class="go" aria-hidden="true">↗</span>{/if}
	</h3>
	{#if work.description}<p class="desc">{work.description}</p>{/if}
{/snippet}

<div class="works">
	{#each items as work, i (work.title + (work.href ?? i))}
		{#if work.href}
			<a class="work" href={work.href} target="_blank" rel="noopener noreferrer" use:reveal>
				{@render inner(work, i)}
				<span class="vine" aria-hidden="true"></span>
			</a>
		{:else}
			<div class="work pending" use:reveal>{@render inner(work, i)}</div>
		{/if}
	{/each}
</div>

<style>
	.works {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.work {
		position: relative;
		display: block;
		padding: 4px 0 38px;
		color: var(--ink);
	}

	/* 상단 메타행 — 넘버 ──── 상태, 폭을 채워 구조를 만든다 */
	.topline {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 18px;
	}
	.num {
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.12em;
		color: var(--accent);
		font-weight: 600;
		flex: 0 0 auto;
		transition: color 320ms ease;
	}
	.pending .num {
		color: var(--ink-faint);
	}
	.rule {
		flex: 1;
		height: 1px;
		background: var(--line);
	}
	.status {
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-faint);
		flex: 0 0 auto;
	}

	.title {
		display: block;
		font-family: var(--font-sans);
		font-size: clamp(30px, 6.2vw, 56px);
		font-weight: 400;
		line-height: 1;
		letter-spacing: -0.038em;
		color: var(--ink);
		margin: 0;
		/* 스크롤 진입 시 아래에서 위로 드러남 */
		clip-path: inset(112% 0 -8% 0);
		opacity: 0;
		transition:
			clip-path 940ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 720ms ease;
	}
	:global(.work[data-revealed]) .title {
		clip-path: inset(0% 0 -8% 0);
		opacity: 1;
	}
	.title .t {
		transition:
			font-weight 360ms cubic-bezier(0.22, 1, 0.36, 1),
			letter-spacing 360ms ease,
			color 320ms ease;
	}
	.go {
		display: inline-block;
		font-size: 0.42em;
		vertical-align: 0.5em;
		margin-left: 0.5em;
		color: var(--ink-faint);
		transition:
			transform 460ms cubic-bezier(0.34, 1.35, 0.64, 1),
			color 320ms ease;
	}
	.desc {
		font-size: 15px;
		color: var(--ink-muted);
		line-height: 1.6;
		margin: 16px 0 0;
		max-width: 460px;
	}

	/* 덩굴 밑줄 — 호버 시 왼쪽에서 자라남 */
	.vine {
		position: absolute;
		left: 0;
		bottom: 14px;
		height: 2px;
		width: 0;
		background: linear-gradient(90deg, var(--accent), var(--accent-pond));
		transition: width 540ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.work:hover .vine {
		width: 100%;
	}
	.work:hover .title .t {
		font-weight: 560;
		letter-spacing: -0.044em;
		color: var(--accent-deep);
	}
	.work:hover .num {
		color: var(--accent);
	}
	.work:hover .go {
		color: var(--accent);
		transform: translate(4px, -4px);
	}

	.pending {
		opacity: 0.72;
	}
	.pending .title {
		color: var(--ink-muted);
	}
</style>
