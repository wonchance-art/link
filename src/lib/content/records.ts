// CMS가 쓰는 마크다운 폴더(src/content/records·principles)를 읽어
// 위성별 entries로 변환. 사이트 화면은 이 모듈만 바라본다.

import { parseFrontmatter, renderMarkdown } from './markdown';
import type { MoonEntry } from './moonSystem';

const recordFiles = import.meta.glob('/src/content/records/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const principleFiles = import.meta.glob('/src/content/principles/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

function toEntries(files: Record<string, string>): Map<string, MoonEntry[]> {
	const byMoon = new Map<string, MoonEntry[]>();
	for (const raw of Object.values(files)) {
		const { data, body } = parseFrontmatter(raw);
		if (!data.moon || !body) continue;
		const list = byMoon.get(data.moon) ?? [];
		list.push({ date: data.date, title: data.title, html: renderMarkdown(body) });
		byMoon.set(data.moon, list);
	}
	// 최신이 위로 — date('YYYY.MM…') 내림차순, 날짜 없는 글은 뒤로
	for (const list of byMoon.values()) {
		list.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
	}
	return byMoon;
}

const records = toEntries(recordFiles);
const principles = toEntries(principleFiles);

export const recordsByMoon = (key: string): MoonEntry[] => records.get(key) ?? [];
export const principlesByMoon = (key: string): MoonEntry[] => principles.get(key) ?? [];
