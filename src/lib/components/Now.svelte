<script lang="ts">
	import type { Lang } from '$lib/i18n/lang';

	type Props = {
		updatedLabel: string;
		body: string;
		lang: Lang;
	};
	let { updatedLabel, body, lang }: Props = $props();

	const main = $derived(lang === 'ko' ? '지금' : 'Now');
	const sub = $derived(lang === 'ko' ? 'Now' : '지금');
</script>

<section class="sect">
	<h2 class="sect-title">
		{main}
		<span class="sub">{sub}</span>
	</h2>
	<div class="now">
		<p class="now-meta">Updated · {updatedLabel}</p>
		<p class="now-body">{body}</p>
	</div>
</section>

<style>
	.now {
		background: rgba(220, 230, 236, 0.55);
		backdrop-filter: blur(18px) saturate(160%);
		-webkit-backdrop-filter: blur(18px) saturate(160%);
		border-radius: 18px;
		padding: 34px 30px;
		border: 1px solid rgba(255, 255, 255, 0.5);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.5),
			0 10px 28px -10px rgba(74, 107, 122, 0.22);
	}
	.now-meta {
		font-size: 11px;
		color: var(--accent-deep);
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin: 0 0 16px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.now-meta::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 0 var(--accent);
		animation: pulse 2.6s infinite;
	}
	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 var(--accent-soft);
		}
		70% {
			box-shadow: 0 0 0 10px transparent;
		}
		100% {
			box-shadow: 0 0 0 0 transparent;
		}
	}
	.now-body {
		font-family: var(--font-serif);
		font-style: italic;
		font-weight: 400;
		font-variation-settings: 'opsz' 144;
		font-feature-settings: 'liga', 'dlig';
		font-size: clamp(22px, 3.4vw, 30px);
		color: var(--ink);
		line-height: 1.3;
		letter-spacing: -0.012em;
		margin: 0;
	}
	@media (max-width: 640px) {
		.now {
			padding: 26px 22px;
		}
		.now-body {
			font-size: 22px;
		}
	}
</style>
