<script lang="ts">
	import type { Link } from '$lib/content/links';

	type Props = { items: Link[] };
	let { items }: Props = $props();
</script>

<section class="sect">
	<h2 class="sect-title">Elsewhere</h2>
	<ul class="links">
		{#each items as link (link.label)}
			<li>
				<a href={link.href}>
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
	}
	.links a {
		display: flex;
		align-items: center;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 16px 18px;
		color: var(--ink);
		font-size: 15px;
		font-weight: 500;
		transition:
			transform 360ms cubic-bezier(0.34, 1.35, 0.64, 1),
			border-color 220ms ease,
			box-shadow 320ms ease;
	}
	.links a:hover {
		transform: translateY(-1px);
		border-color: var(--accent-soft);
		box-shadow: 0 12px 28px -14px var(--accent-soft);
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
	}
	a:not(:has(.meta)) .arrow {
		margin-left: auto;
	}
	.arrow {
		color: var(--ink-faint);
		transition:
			transform 200ms ease,
			color 200ms ease;
	}
	a:hover .arrow {
		color: var(--accent);
		transform: translateX(3px);
	}
</style>
