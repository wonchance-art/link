import { marked } from 'marked';

// CMS(마크다운 파일)용 최소 도구 — 단순 frontmatter 파서 + 렌더러.
// frontmatter는 `key: value` 스칼라만 사용(중첩 없음). 본문은 marked로 HTML화.
// 렌더 대상은 인증된 CMS로 본인이 쓴 글뿐이라 sanitizer는 두지 않는다.

export type FrontmatterDoc = {
	data: Record<string, string>;
	body: string;
};

export function parseFrontmatter(raw: string): FrontmatterDoc {
	const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
	if (!m) return { data: {}, body: raw.trim() };
	const data: Record<string, string> = {};
	for (const line of m[1].split(/\r?\n/)) {
		const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
		if (!kv) continue;
		let v = kv[2].trim();
		if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
			v = v.slice(1, -1);
		}
		if (v) data[kv[1]] = v;
	}
	return { data, body: m[2].trim() };
}

export function renderMarkdown(md: string): string {
	return marked.parse(md, { async: false }) as string;
}
