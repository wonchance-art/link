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
		padding: 16px 18px 16px 20px;
		color: var(--ink);
		font-size: 15px;
		font-weight: 500;
		/* 좌측 1px pond 컬러 strip — Elsewhere의 시각 정체성 */
		box-shadow: inset 1px 0 0 var(--accent-pond);
		transition:
			transform 360ms cubic-bezier(0.34, 1.35, 0.64, 1),
			border-color 220ms ease,
			box-shadow 320ms ease;
	}
	.links a:hover {
		transform: translateY(-1px);
		border-color: var(--accent-soft);
		box-shadow:
			inset 2px 0 0 var(--accent-pond),
			0 14px 30px -14px rgba(74, 107, 122, 0.28);
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
