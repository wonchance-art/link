// 토성 고리 텍스처 — 스트립(반경 프로파일)을 극좌표로 원형 텍스처화.
// 픽셀 루프는 행 청크로 나눠 메인스레드 블로킹 방지. 성공 시 dataURL, 실패 시 ''.

let cached = '';
let building: Promise<string> | null = null;

export function buildRingTexture(): Promise<string> {
	if (cached) return Promise.resolve(cached);
	if (building) return building;
	if (typeof document === 'undefined') return Promise.resolve('');
	building = build().finally(() => {
		building = null;
	});
	return building;
}

async function build(): Promise<string> {
	try {
		const strip = new Image();
		strip.src = '/saturn_ring.png';
		// decode()는 숨김 탭에서 보류될 수 있어 load 이벤트로 대기
		await new Promise<void>((resolve, reject) => {
			if (strip.complete && strip.naturalWidth) return resolve();
			strip.onload = () => resolve();
			strip.onerror = () => reject(new Error('saturn_ring.png load failed'));
		});
		const sw = strip.width,
			sh = strip.height;
		const sc = document.createElement('canvas');
		sc.width = sw;
		sc.height = sh;
		const sctx = sc.getContext('2d');
		if (!sctx) return '';
		sctx.drawImage(strip, 0, 0);
		const srow = sctx.getImageData(0, Math.floor(sh / 2), sw, 1).data;
		const N = 1280;
		const CHUNK = 160; // 행 단위 청크 — 사이마다 태스크 양보
		const out = document.createElement('canvas');
		out.width = N;
		out.height = N;
		const octx = out.getContext('2d');
		if (!octx) return '';
		const od = octx.createImageData(N, N);
		const cx = N / 2,
			cy = N / 2,
			rOut = N / 2 - 1,
			rIn = rOut * 0.42;
		for (let y0 = 0; y0 < N; y0 += CHUNK) {
			const yEnd = Math.min(N, y0 + CHUNK);
			for (let y = y0; y < yEnd; y++)
				for (let x = 0; x < N; x++) {
					const dx = x - cx,
						dy = y - cy,
						d = Math.hypot(dx, dy),
						i = (y * N + x) * 4;
					if (d >= rIn && d <= rOut) {
						const t = (d - rIn) / (rOut - rIn);
						const sx = Math.min(sw - 1, Math.floor(t * sw));
						od.data[i] = srow[sx * 4];
						od.data[i + 1] = srow[sx * 4 + 1];
						od.data[i + 2] = srow[sx * 4 + 2];
						od.data[i + 3] = srow[sx * 4 + 3];
					}
				}
			await new Promise((r) => setTimeout(r, 0));
		}
		octx.putImageData(od, 0, 0);
		cached = out.toDataURL('image/png');
		return cached;
	} catch (err) {
		console.warn('토성 고리 텍스처 생성 실패 — 고리 없이 렌더링:', err);
		return '';
	}
}
