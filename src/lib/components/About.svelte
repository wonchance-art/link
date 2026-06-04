<script lang="ts">
	type Props = { body: string };
	let { body }: Props = $props();
</script>

<section class="sect">
	<h2 class="sect-title">About</h2>
	<p>{body}</p>
</section>

<style>
	p {
		font-size: 16px;
		line-height: 1.85;
		color: var(--ink);
		margin: 0;
	}
</style>
