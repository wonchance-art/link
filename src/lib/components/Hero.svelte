<script lang="ts">
	type Props = {
		name: string;
		subtitle: string;
		tag: string;
	};

	let { name, subtitle, tag }: Props = $props();

	// *…* 를 <em>…</em>으로. 본문 강조의 가장 가벼운 방법.
	const tagHtml = $derived(tag.replace(/\*(.+?)\*/g, '<em>$1</em>'));
</script>

<section class="hero">
	<h1 class="name">
		{name}
		<span class="subtitle">{subtitle}</span>
	</h1>
	<p class="tag">{@html tagHtml}</p>
</section>

<style>
	.hero {
		margin-bottom: var(--s-6);
	}
	.name {
		font-family: var(--font-sans);
		font-size: 52px;
		font-weight: 500;
		line-height: 1.12;
		letter-spacing: -0.025em;
		color: var(--ink);
		margin: 0 0 16px;
		transition:
			font-weight 420ms ease,
			letter-spacing 420ms ease;
		cursor: default;
	}
	.name:hover {
		font-weight: 700;
		letter-spacing: -0.032em;
	}
	.name .subtitle {
		display: block;
		font-size: 18px;
		font-weight: 400;
		letter-spacing: 0.02em;
		color: var(--accent);
		margin-top: 8px;
		font-style: italic;
	}
	.tag {
		font-size: 16px;
		color: var(--ink-muted);
		line-height: 1.75;
		margin: 0;
		max-width: 420px;
	}
	.tag :global(em) {
		font-style: normal;
		color: var(--accent-deep);
		font-weight: 600;
	}
</style>
