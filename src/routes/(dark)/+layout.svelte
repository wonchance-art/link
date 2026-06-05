<script lang="ts">
	let { children } = $props();

	// 우주·천체 페이지는 검은 배경. 그룹 레이아웃이 유지되어 다크 페이지 간 전환 시 깜빡임 없음.
	$effect(() => {
		document.body.classList.add('cosmic');
		return () => document.body.classList.remove('cosmic');
	});
</script>

{@render children()}
