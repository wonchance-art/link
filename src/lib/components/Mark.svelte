<script lang="ts">
	import type { Lang } from '$lib/i18n/lang';

	type Props = { index: string; ko: string; en: string; lang: Lang };
	let { index, ko, en, lang }: Props = $props();

	const main = $derived(lang === 'ko' ? ko : en);
	const sub = $derived(lang === 'ko' ? en : ko);
</script>

<div class="mark">
	<span class="idx">{index}</span>
	<span class="label">{main}</span>
	<span class="sub">{sub}</span>
	<span class="rule" aria-hidden="true"></span>
</div>

<style>
	.mark {
		display: flex;
		align-items: baseline;
		gap: 14px;
		margin: 0 0 26px;
	}
	.idx {
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.12em;
		color: var(--accent);
		font-weight: 600;
		flex: 0 0 auto;
	}
	.label {
		font-family: var(--font-serif);
		font-style: italic;
		font-weight: 400;
		font-size: 16px;
		color: var(--ink-muted);
		font-variation-settings: 'opsz' 14;
		font-feature-settings: 'liga', 'dlig';
		flex: 0 0 auto;
	}
	.sub {
		font-size: 11px;
		letter-spacing: 0.05em;
		color: var(--ink-faint);
		flex: 0 0 auto;
	}
	.rule {
		flex: 1;
		height: 1px;
		background: var(--line);
		align-self: center;
	}
</style>
