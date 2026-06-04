<script lang="ts">
	type Props = {
		updatedLabel: string;
		body: string;
	};
	let { updatedLabel, body }: Props = $props();
</script>

<section class="sect">
	<h2 class="sect-title">Now</h2>
	<div class="now">
		<p class="now-meta">Updated · {updatedLabel}</p>
		<p class="now-body">{body}</p>
	</div>
</section>

<style>
	.now {
		background: var(--wash-sky);
		border-radius: 18px;
		padding: 34px 30px;
		border: 1px solid rgba(74, 107, 122, 0.14);
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
	/* 본문 — 잡지 인용구 같은 큰 serif italic */
	.now-body {
		font-family: var(--font-serif);
		font-style: italic;
		font-weight: 400;
		font-variation-settings: 'opsz' 144;
		font-size: clamp(28px, 4.6vw, 38px);
		color: var(--ink);
		line-height: 1.25;
		letter-spacing: -0.012em;
		margin: 0;
	}
	@media (max-width: 640px) {
		.now {
			padding: 28px 24px;
		}
		.now-body {
			font-size: 26px;
		}
	}
</style>
