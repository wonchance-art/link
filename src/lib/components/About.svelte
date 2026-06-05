<script lang="ts">
	type Props = { body: string };
	let { body }: Props = $props();

	// *…* → bloom em
	const html = $derived(body.replace(/\*(.+?)\*/g, '<em>$1</em>'));
</script>

<p class="lead">{@html html}</p>

<style>
	.lead {
		font-size: clamp(20px, 2.8vw, 28px);
		line-height: 1.62;
		letter-spacing: -0.01em;
		color: var(--ink);
		margin: 0;
		max-width: 620px;
		font-weight: 380;
	}
	.lead :global(em) {
		font-family: var(--font-serif);
		font-style: italic;
		color: var(--accent-deep);
		font-weight: 500;
		font-variation-settings: 'opsz' 144;
		font-feature-settings: 'liga', 'dlig';
		transition:
			color 280ms ease,
			letter-spacing 280ms ease;
	}
	.lead :global(em:hover) {
		color: var(--accent);
		letter-spacing: 0.008em;
	}
</style>
