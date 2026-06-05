<script lang="ts">
	import type { Link } from '$lib/content/links';

	type Props = { items: Link[] };
	let { items }: Props = $props();
</script>

<nav class="elsewhere">
	{#each items as link, i (link.label)}
		{#if i > 0}<span class="dot" aria-hidden="true">·</span>{/if}
		<a href={link.href} target="_blank" rel="noopener noreferrer">
			<span class="label">{link.label}</span>
			{#if link.meta}<span class="meta">{link.meta}</span>{/if}
		</a>
	{/each}
</nav>

<style>
	.elsewhere {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 14px;
	}
	.dot {
		color: var(--ink-faint);
		opacity: 0.6;
	}
	a {
		display: inline-flex;
		align-items: baseline;
		gap: 8px;
		color: var(--ink);
		font-size: clamp(18px, 2.6vw, 24px);
		letter-spacing: -0.01em;
		transition: color 260ms ease;
	}
	.label {
		position: relative;
	}
	.label::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -2px;
		height: 1.5px;
		width: 0;
		background: var(--accent-pond);
		transition: width 360ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	a:hover {
		color: var(--accent-pond);
	}
	a:hover .label::after {
		width: 100%;
	}
	.meta {
		font-size: 12px;
		color: var(--ink-faint);
		letter-spacing: 0.02em;
	}
</style>
