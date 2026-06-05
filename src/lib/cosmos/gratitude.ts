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

export const gratitudeStars: GratitudeStar[] = [
	{ id: 'mother', x: 22, y: 14, name: '어머니', note: '내가 처음 들은 목소리. 모든 다정함의 시작.' },
	{ id: 'friend', x: 64, y: 11, name: '오랜 친구', note: '말하지 않아도 아는 사이. 멀어도 가까운.' },
	{ id: 'rain', x: 40, y: 20, name: '비 오는 날', note: '창을 두드리는 소리에 마음이 천천히 가라앉는다.' },
	{ id: 'first-line', x: 78, y: 22, name: '첫 문장', note: '처음으로 내 손끝에서 제 빛깔을 낸 한 줄.' },
	{ id: 'sea', x: 13, y: 30, name: '바다', note: '끝이 보이지 않아 오히려 안심이 되는 것.' },
	{ id: 'night-music', x: 52, y: 33, name: '늦은 밤의 음악', note: '혼자가 아니라고 조용히 말해주는 소리.' },
	{ id: 'grandma', x: 30, y: 40, name: '할머니의 손', note: '주름마다 담긴 여러 계절.' },
	{ id: 'book', x: 70, y: 42, name: '한 권의 책', note: '다른 삶을 잠시 살게 해준 페이지들.' },
	{ id: 'dawn', x: 86, y: 52, name: '새벽 산책', note: '아무도 깨지 않은 시간의 고요.' },
	{ id: 'you', x: 46, y: 58, name: '너', note: '지금 이 글을 읽고 있는, 당신.' }
];
