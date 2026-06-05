<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	type Props = {
		updatedLabel: string;
		body: string;
	};
	let { updatedLabel, body }: Props = $props();
</script>

<div class="now" use:reveal>
	<p class="meta"><span class="pulse" aria-hidden="true"></span>Updated · {updatedLabel}</p>
	<p class="body">{body}</p>
</div>

<style>
	.now {
		position: relative;
		padding-left: clamp(18px, 4vw, 26px);
	}
	/* 좌측 보더 — 위는 accent, 아래로 사라지는 그라데이션 */
	.now::before {
		content: '';
		position: absolute;
		left: 0;
		top: 3px;
		bottom: 6px;
		width: 2px;
		border-radius: 2px;
		background: linear-gradient(180deg, var(--accent) 0%, var(--accent-pond) 45%, transparent 100%);
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
	/* 더 가벼운 beat — 이전 clamp(24,4vw,38)에서 축소 */
	.body {
		font-family: var(--font-serif);
		font-style: italic;
		font-weight: 400;
		font-variation-settings: 'opsz' 144;
		font-feature-settings: 'liga', 'dlig';
		font-size: clamp(21px, 3vw, 30px);
		color: var(--ink);
		line-height: 1.38;
		letter-spacing: -0.012em;
		margin: 0;
		max-width: 560px;
		clip-path: inset(110% 0 -8% 0);
		opacity: 0;
		transition:
			clip-path 940ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 720ms ease;
	}
	:global(.now[data-revealed]) .body {
		clip-path: inset(0% 0 -8% 0);
		opacity: 1;
	}
</style>
