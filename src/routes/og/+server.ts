import satori from 'satori';
import { html as toReact } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import { profile } from '$lib/content/profile';
import { resolveLang } from '$lib/i18n/lang';

const WIDTH = 1200;
const HEIGHT = 630;

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

	const eyebrow = 'OPEN CHAENCE';
	const footerLabel = lang === 'ko' ? '풀숲 · 하늘 · 연못' : 'Grove · Sky · Pond';

	const charset = [
		...new Set([p.name, p.subtitle, tag, eyebrow, footerLabel, 'link-fnup.vercel.app'].join(''))
	].join('');

	const [bold, regular, semi] = await Promise.all([
		loadFont('Noto+Sans+KR', charset, 700),
		loadFont('Noto+Sans+KR', charset, 400),
		loadFont('Noto+Sans+KR', charset, 600)
	]);

	const markup = toReact(`
		<div style="
			width: 100%; height: 100%;
			display: flex; flex-direction: column; justify-content: space-between;
			padding: 84px 96px;
			background: linear-gradient(135deg, #E5EDDF 0%, #E2E8E6 50%, #DCE6EC 100%);
			font-family: NotoSansKR;
			color: #1F2A2A;
		">
			<div style="display: flex; align-items: center; gap: 14px;">
				<div style="width: 11px; height: 11px; border-radius: 9999px; background: #4E6B4A;"></div>
				<div style="font-size: 23px; color: #4E6B4A; font-weight: 700; letter-spacing: 9px;">
					${eyebrow}
				</div>
			</div>

			<div style="display: flex; flex-direction: column; gap: 32px;">
				<div style="font-size: 168px; font-weight: 600; line-height: 0.94; letter-spacing: -4px;">
					${p.name}
				</div>
				<div style="font-size: 30px; color: #586863; line-height: 1.5; max-width: 880px; font-weight: 400;">
					${tag}
				</div>
			</div>

			<div style="display: flex; align-items: flex-end; justify-content: space-between; font-size: 19px; color: #98A19B;">
				<span style="font-weight: 400; letter-spacing: 0.6px;">link-fnup.vercel.app</span>
				<div style="display: flex; align-items: center; gap: 20px;">
					<span style="font-weight: 400; letter-spacing: 1.8px;">${footerLabel}</span>
					<div style="display: flex; gap: 5px;">
						<div style="width: 7px; height: 7px; border-radius: 9999px; background: #4E6B4A;"></div>
						<div style="width: 7px; height: 7px; border-radius: 9999px; background: #4A6B7A;"></div>
						<div style="width: 7px; height: 7px; border-radius: 9999px; background: #98A19B;"></div>
					</div>
				</div>
			</div>
		</div>
	`);

	const svg = await satori(markup, {
		width: WIDTH,
		height: HEIGHT,
		fonts: [
			{ name: 'NotoSansKR', data: bold, weight: 700, style: 'normal' },
			{ name: 'NotoSansKR', data: semi, weight: 600, style: 'normal' },
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
