<script lang="ts">
	import type { Work } from '$lib/content/works';

	type Props = { items: Work[] };
	let { items }: Props = $props();
</script>

<section class="sect">
	<h2 class="sect-title">Works</h2>
	<ul class="works">
		{#each items as work (work.title + work.href)}
			<li>
				<a href={work.href}>
					<div class="row">
						<span class="title">{work.title}</span>
						<span class="trail">
							{#if work.date}<span class="date">{work.date}</span>{/if}
							<span class="arrow">→</span>
						</span>
					</div>
					<p class="desc">{work.description}</p>
				</a>
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
	}
	.works a {
		display: block;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 18px 20px;
		color: var(--ink);
		transition:
			transform 220ms ease,
			border-color 220ms ease,
			box-shadow 220ms ease;
	}
	.works a:hover {
		transform: translateY(-1px);
		border-color: var(--accent-soft);
		box-shadow: 0 12px 28px -14px var(--accent-soft);
	}
	.row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 6px;
	}
	.title {
		font-size: 16px;
		font-weight: 600;
		color: var(--ink);
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
	}
	.arrow {
		color: var(--ink-faint);
		transition:
			transform 200ms ease,
			color 200ms ease;
	}
	.works a:hover .arrow {
		color: var(--accent);
		transform: translateX(3px);
	}
	.desc {
		font-size: 14px;
		color: var(--ink-muted);
		line-height: 1.6;
		margin: 0;
	}
</style>
