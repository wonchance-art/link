import { LAND_PATH } from '$lib/cosmos/earth';

// 육지 경로를 서버에서만 계산 → d3-geo·topojson·지리 JSON이 클라이언트 번들에 안 들어감.
export const load = () => ({ landPath: LAND_PATH });
