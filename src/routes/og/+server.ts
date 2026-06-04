import satori from 'satori';
import { html as toReact } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import { profile } from '$lib/content/profile';
import { resolveLang } from '$lib/i18n/lang';

const WIDTH = 1200;
const HEIGHT = 630;

// Google Fonts 동적 subset — text=에 들어간 글자만 받아오므로 가벼움.
async function loadFont(family: string, text: string, weight: number) {
	const cssRes = await fetch(
		`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`,
		{ headers: { 'User-Agent': 'Mozilla/5.0' } }
	);
	const css = await cssRes.text();
	const fontUrl = css.match(/src:\s*url\((.+?)\)/)?.[1];
	if (!fontUrl) throw new Error(`Font URL not found for ${family}`);
	const fontRes = await fetch(fontUrl);
	return await fontRes.arrayBuffer();
}

export const GET = async ({ url }) => {
	const lang = resolveLang(url.searchParams.get('lang'));
	const p = profile[lang];
	const tag = p.tag.replace(/\*/g, '');

	const eyebrow = 'OPEN CHAENCE'; // 사이트 우산 — OG 미니 라벨
	const footerLabel = lang === 'ko' ? '풀숲 · 하늘 · 연못' : 'Grove · Sky · Pond';

	const charset = [
		...new Set(
			[p.name, p.subtitle, tag, eyebrow, footerLabel, 'link-fnup.vercel.app'].join('')
		)
	].join('');

	const [bold, regular] = await Promise.all([
		loadFont('Noto+Sans+KR', charset, 700),
		loadFont('Noto+Sans+KR', charset, 400)
	]);

	const markup = toReact(`
		<div style="
			width: 100%; height: 100%;
			display: flex; flex-direction: column; justify-content: space-between;
			padding: 80px;
			background: linear-gradient(135deg, #E5EDDF 0%, #DCE6EC 100%);
			font-family: NotoSansKR;
			color: #1F2A2A;
		">
			<div style="display: flex; align-items: center; gap: 14px;">
				<div style="width: 14px; height: 14px; border-radius: 9999px; background: #4E6B4A;"></div>
				<div style="font-size: 26px; color: #4E6B4A; font-weight: 700; letter-spacing: 6px;">
					${eyebrow}
				</div>
			</div>

			<div style="display: flex; flex-direction: column; gap: 28px;">
				<div style="font-size: 150px; font-weight: 700; line-height: 1; letter-spacing: -3px;">
					${p.name}
				</div>
				<div style="font-size: 30px; color: #586863; line-height: 1.5; max-width: 940px;">
					${tag}
				</div>
			</div>

			<div style="display: flex; align-items: center; justify-content: space-between; font-size: 20px; color: #98A19B;">
				<span>link-fnup.vercel.app</span>
				<span>${footerLabel}</span>
			</div>
		</div>
	`);

	const svg = await satori(markup, {
		width: WIDTH,
		height: HEIGHT,
		fonts: [
			{ name: 'NotoSansKR', data: bold, weight: 700, style: 'normal' },
			{ name: 'NotoSansKR', data: regular, weight: 400, style: 'normal' }
		]
	});

	const png = new Resvg(svg).render().asPng();

	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
