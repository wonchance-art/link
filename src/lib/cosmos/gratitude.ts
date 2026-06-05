// 은하 = 나의 세계 (삶의 아름다움·의미·풍요의 총체).
// 별 하나하나 = 내가 감사하는 존재·순간. 누르면 그 글이 뜬다.
// 은하 쪽(위쪽 아치)에 몰리도록 좌표를 배치. 내용은 자유로이 교체.

export type GratitudeStar = {
	id: string;
	x: number; // % (좌)
	y: number; // % (상)
	name: string;
	note: string;
};

// y는 은하 아치(galaxyArchY)를 따라 배치 — 별들이 은하수 띠 위에 모이도록.
export const gratitudeStars: GratitudeStar[] = [
	{ id: 'sea', x: 8, y: 64, name: '바다', note: '끝이 보이지 않아 오히려 안심이 되는 것.' },
	{ id: 'mother', x: 15, y: 41, name: '어머니', note: '내가 처음 들은 목소리. 모든 다정함의 시작.' },
	{ id: 'grandma', x: 24, y: 58, name: '할머니의 손', note: '주름마다 담긴 여러 계절.' },
	{ id: 'you', x: 33, y: 44, name: '너', note: '지금 이 글을 읽고 있는, 당신.' },
	{ id: 'night-music', x: 39, y: 62, name: '늦은 밤의 음악', note: '혼자가 아니라고 조용히 말해주는 소리.' },
	{ id: 'friend', x: 61, y: 39, name: '오랜 친구', note: '말하지 않아도 아는 사이. 멀어도 가까운.' },
	{ id: 'book', x: 68, y: 57, name: '한 권의 책', note: '다른 삶을 잠시 살게 해준 페이지들.' },
	{ id: 'rain', x: 76, y: 43, name: '비 오는 날', note: '창을 두드리는 소리에 마음이 천천히 가라앉는다.' },
	{ id: 'first-line', x: 84, y: 60, name: '첫 문장', note: '처음으로 내 손끝에서 제 빛깔을 낸 한 줄.' },
	{ id: 'dawn', x: 92, y: 45, name: '새벽 산책', note: '아무도 깨지 않은 시간의 고요.' }
];
