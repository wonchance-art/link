<script lang="ts">
	const links = [
		{ label: '서재 — 읽은 책', meta: '128권', href: '#' },
		{ label: '글방 — 쓴 것', meta: '최근 6월 1일', href: '#' },
		{ label: 'Instagram', meta: '@chaeyeon', href: '#' },
		{ label: 'Email', href: 'mailto:hello@example.com' }
	];

	const guestbook = [
		{ name: '풀잎', message: '오늘 글이 마음에 오래 남았어요.' },
		{ name: '유월', message: '비 오는 오후를 좋아하시다니, 저랑 비슷하네요 :)' },
		{ name: '익명', message: '좋은 하루 보내세요.' }
	];
</script>

<svelte:head>
	<title>이채연 · 글방</title>
	<meta
		name="description"
		content="글을 쓰고 읽으며 언어를 공부합니다. 풀숲과 하늘 사이의 1페이지."
	/>
</svelte:head>

<main class="page">
	<section class="hero">
		<h1 class="name">
			이채연
			<span class="en">Chaeyeon · 글방</span>
		</h1>
		<p class="tag">
			글을 쓰고 읽으며 언어를 공부합니다. 사람과 자연, 그리고 사람과 사람 사이의
			<em>깊은 연대</em>에 마음이 머뭅니다.
		</p>
	</section>

	<section class="sect">
		<h2 class="sect-title">About</h2>
		<div class="about">
			<p>천천히 읽고 천천히 씁니다. 풀잎 위에 비친 하늘처럼, 글도 여러 결이 어우러지기를 바랍니다.</p>
		</div>
	</section>

	<section class="sect">
		<h2 class="sect-title">Links</h2>
		<ul class="links">
			{#each links as link (link.label)}
				<li>
					<a href={link.href}>
						<span class="label">{link.label}</span>
						{#if link.meta}<span class="meta">{link.meta}</span>{/if}
						<span class="arrow">→</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="sect">
		<h2 class="sect-title">Now</h2>
		<div class="now">
			<p class="now-meta">Updated · 6월 5일</p>
			<p>도연명의 「귀거래사」를 다시 읽고 있어요. 마당에 토마토 모종 둘. 비 오는 오후를 좋아하게 됐습니다.</p>
		</div>
	</section>

	<section class="sect">
		<h2 class="sect-title">Guestbook</h2>
		<div class="gb">
			<div class="gb-items">
				{#each guestbook as entry (entry.name + entry.message)}
					<div class="gb-item"><b>{entry.name}</b>{entry.message}</div>
				{/each}
			</div>
			<form class="gb-input" onsubmit={(e) => e.preventDefault()}>
				<input placeholder="한 줄 남기고 가세요 — 닉네임은 자유로이" />
				<button type="submit">남기기</button>
			</form>
		</div>
	</section>

	<footer class="foot">
		<span>© 2026 · chaeyeon</span>
		<span class="lang">
			<span class="on">한국어</span>
			<span>·</span>
			<span>EN</span>
			<a href="/rss.xml">RSS</a>
		</span>
	</footer>
</main>

<style>
	.page {
		max-width: var(--col-width);
		margin: 0 auto;
		padding: 80px 32px 64px;
	}
	@media (max-width: 640px) {
		.page {
			padding: 56px 24px 48px;
		}
	}

	/* === Hero === */
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
	.name .en {
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
	.tag em {
		font-style: normal;
		color: var(--accent-deep);
		font-weight: 600;
	}

	/* === Section === */
	.sect {
		margin-top: 56px;
	}
	.sect-title {
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-faint);
		margin: 0 0 20px;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.sect-title::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--line);
	}

	/* === About === */
	.about p {
		font-size: 16px;
		line-height: 1.85;
		color: var(--ink);
		margin: 0;
	}

	/* === Links === */
	.links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 10px;
	}
	.links a {
		display: flex;
		align-items: center;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: 14px;
		padding: 16px 18px;
		color: var(--ink);
		font-size: 15px;
		font-weight: 500;
		transition:
			transform 220ms ease,
			border-color 220ms ease,
			box-shadow 220ms ease;
	}
	.links a:hover {
		transform: translateY(-1px);
		border-color: var(--accent-soft);
		box-shadow: 0 12px 28px -14px var(--accent-soft);
	}
	.links .label {
		flex: 0 0 auto;
	}
	.links .meta {
		font-size: 12px;
		color: var(--ink-faint);
		font-weight: 400;
		margin-left: auto;
		margin-right: 16px;
	}
	.links a:not(:has(.meta)) .arrow {
		margin-left: auto;
	}
	.links .arrow {
		color: var(--ink-faint);
		transition:
			transform 200ms ease,
			color 200ms ease;
	}
	.links a:hover .arrow {
		color: var(--accent);
		transform: translateX(3px);
	}

	/* === Now (하늘 워시) === */
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
	.now p {
		font-size: 15px;
		color: var(--ink);
		line-height: 1.75;
		margin: 0;
	}

	/* === Guestbook (옅은 연못 워시) === */
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

	/* === Footer === */
	.foot {
		margin-top: 80px;
		padding-top: 28px;
		border-top: 1px solid var(--line);
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		color: var(--ink-faint);
		letter-spacing: 0.02em;
	}
	.foot a {
		color: var(--ink-muted);
		margin-left: 16px;
	}
	.foot a:hover {
		color: var(--accent);
	}
	.foot .lang span {
		padding: 0 6px;
	}
	.foot .lang .on {
		color: var(--accent);
		font-weight: 600;
	}
</style>
