<script lang="ts">
	import type { Link } from '$lib/content/links';
	import type { Lang } from '$lib/i18n/lang';
	import { tilt3d } from '$lib/actions/tilt3d';

	type Props = { items: Link[]; lang: Lang };
	let { items, lang }: Props = $props();

	const main = $derived(lang === 'ko' ? '그 외' : 'Elsewhere');
	const sub = $derived(lang === 'ko' ? 'Elsewhere' : '그 외');
</script>

<section class="sect sect-tight">
	<h2 class="sect-title">
		{main}
		<span class="sub">{sub}</span>
	</h2>
	<ul class="links">
		{#each items as link (link.label)}
			<li>
				<a href={link.href} use:tilt3d>
					{#if link.icon === 'instagram'}
						<svg
							class="icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
							<circle cx="12" cy="12" r="3.5" />
							<circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
						</svg>
					{:else if link.icon === 'blog'}
						<svg
							class="icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M14 4 L20 10 L9 21 L3 21 L3 15 Z" />
							<path d="M13 5 L19 11" />
						</svg>
					{:else if link.icon === 'email'}
						<svg
							class="icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<rect x="3" y="5.5" width="18" height="13" rx="2" />
							<path d="M3 7.5 L12 13.5 L21 7.5" />
						</svg>
					{/if}
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
		gap: 8px;
		perspective: 1000px;
	}
	.links a {
		display: flex;
		align-items: center;
		background: rgba(251, 250, 246, 0.5);
		backdrop-filter: blur(12px) saturate(140%);
		-webkit-backdrop-filter: blur(12px) saturate(140%);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 12px 16px 12px 18px;
		color: var(--ink);
		font-size: 14px;
		font-weight: 500;
		transform-style: preserve-3d;
		--hover-y: 0px;
		transform: rotateX(var(--ty-deg, 0deg)) rotateY(var(--tx-deg, 0deg))
			translateY(var(--hover-y));
		box-shadow:
			inset 1px 0 0 var(--accent-pond),
			inset 0 1px 0 rgba(255, 255, 255, 0.45),
			0 5px 14px -6px rgba(74, 107, 122, 0.14);
		transition:
			transform 420ms cubic-bezier(0.34, 1.35, 0.64, 1),
			border-color 220ms ease,
			box-shadow 360ms ease,
			background 280ms ease;
	}
	.links a:hover {
		--hover-y: -2px;
		background: rgba(251, 250, 246, 0.78);
		border-color: var(--accent-soft);
		box-shadow:
			inset 2px 0 0 var(--accent-pond),
			inset 0 1px 0 rgba(255, 255, 255, 0.55),
			0 18px 36px -16px rgba(74, 107, 122, 0.28),
			0 3px 6px rgba(31, 42, 42, 0.04);
	}
	.links a:active {
		--hover-y: 0px;
		--tx-deg: 0deg;
		--ty-deg: 0deg;
		transform: scale(0.985);
		transition: transform 140ms ease;
	}

	.icon {
		width: 16px;
		height: 16px;
		color: var(--accent-pond);
		flex: 0 0 auto;
		margin-right: 12px;
		opacity: 0.7;
		transition:
			opacity 280ms ease,
			color 320ms ease,
			transform 360ms cubic-bezier(0.34, 1.35, 0.64, 1);
	}
	a:hover .icon {
		opacity: 1;
		transform: scale(1.06);
	}

	.label {
		flex: 0 0 auto;
	}
	.meta {
		font-size: 11px;
		color: var(--ink-faint);
		font-weight: 400;
		margin-left: auto;
		margin-right: 14px;
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
