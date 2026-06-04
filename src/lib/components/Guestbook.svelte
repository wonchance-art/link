<script lang="ts">
	import type { GuestbookEntry } from '$lib/content/guestbook';

	type UI = { placeholder: string; submit: string };
	type Props = { entries: GuestbookEntry[]; ui: UI };
	let { entries, ui }: Props = $props();
</script>

<section class="sect">
	<h2 class="sect-title">Guestbook</h2>
	<div class="gb">
		<div class="gb-items">
			{#each entries as entry (entry.name + entry.message)}
				<div class="gb-item"><b>{entry.name}</b>{entry.message}</div>
			{/each}
		</div>
		<form class="gb-input" onsubmit={(e) => e.preventDefault()}>
			<input placeholder={ui.placeholder} />
			<button type="submit">{ui.submit}</button>
		</form>
	</div>
</section>

<style>
	.gb {
		background: var(--wash-pond);
		border-radius: 16px;
		padding: 22px 24px;
		border: 1px solid rgba(74, 107, 122, 0.1);
	}
	.gb-items {
		display: grid;
		gap: 10px;
		margin-bottom: 14px;
	}
	.gb-item {
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 12px 14px;
		font-size: 14px;
		color: var(--ink-muted);
		line-height: 1.6;
	}
	.gb-item b {
		color: var(--accent-pond);
		font-weight: 600;
		margin-right: 8px;
	}
	.gb-input {
		display: flex;
		gap: 8px;
		background: var(--surface);
		border-radius: 12px;
		padding: 6px 8px 6px 14px;
		border: 1px solid var(--line);
	}
	.gb-input input {
		flex: 1;
		border: none;
		background: transparent;
		font-size: 13px;
		color: var(--ink);
		outline: none;
	}
	.gb-input input::placeholder {
		color: var(--ink-faint);
	}
	.gb-input button {
		background: var(--accent);
		color: var(--surface);
		border: none;
		border-radius: 8px;
		font-size: 12px;
		font-weight: 600;
		padding: 8px 14px;
	}
</style>
