<script lang="ts">
	type Props = {
		updatedLabel: string;
		body: string;
	};
	let { updatedLabel, body }: Props = $props();
</script>

<div class="now">
	<p class="meta"><span class="pulse" aria-hidden="true"></span>Updated · {updatedLabel}</p>
	<p class="body">{body}</p>
</div>

<style>
	.now {
		padding-left: clamp(18px, 4vw, 28px);
		border-left: 2px solid var(--accent-soft);
	}
	.meta {
		font-size: 11px;
		color: var(--accent-deep);
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin: 0 0 14px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.pulse {
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
	.body {
		font-family: var(--font-serif);
		font-style: italic;
		font-weight: 400;
		font-variation-settings: 'opsz' 144;
		font-feature-settings: 'liga', 'dlig';
		font-size: clamp(24px, 4vw, 38px);
		color: var(--ink);
		line-height: 1.32;
		letter-spacing: -0.014em;
		margin: 0;
		max-width: 600px;
	}
</style>
