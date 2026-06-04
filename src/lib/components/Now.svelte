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
		<p>{body}</p>
	</div>
</section>

<style>
	.now {
		background: var(--wash-sky);
		border-radius: 16px;
		padding: 22px 24px;
		border: 1px solid rgba(74, 107, 122, 0.14);
	}
	.now-meta {
		font-size: 11px;
		color: var(--accent-deep);
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin: 0 0 10px;
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
	p {
		font-size: 15px;
		color: var(--ink);
		line-height: 1.75;
		margin: 0;
	}
</style>
