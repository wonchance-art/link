<script lang="ts">
	type Props = { body: string };
	let { body }: Props = $props();
</script>

<section class="sect">
	<h2 class="sect-title">About</h2>
	<p class="body">{body}</p>
</section>

<style>
	.body {
		font-size: 17px;
		line-height: 1.88;
		color: var(--ink);
		margin: 0;
	}
	/* 잡지 drop cap — 첫 글자 큰 serif italic, accent-deep */
	.body::first-letter {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 2.6em;
		font-weight: 500;
		line-height: 1;
		float: left;
		margin: 6px 12px -4px 0;
		color: var(--accent-deep);
		font-variation-settings: 'opsz' 144;
	}
	/* 한국어는 italic이 fake skew라 어색 — 정자체 큰 글씨 */
	:global(html[lang='ko']) .body::first-letter {
		font-style: normal;
		font-weight: 600;
		letter-spacing: -0.02em;
	}
</style>
