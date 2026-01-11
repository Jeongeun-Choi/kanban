export const isOverdue = (dateString?: string): boolean => {
  if (!dateString) return false;

  const dueDate = new Date(dateString);
  const today = new Date();

  // 날짜 문자열이 YYYY-MM-DD 형식만 포함하는 경우 공정한 비교를 위해
  // 시간을 00:00:00으로 설정하여 날짜만 비교합니다.
  // 오늘 날짜까지는 연체로 보지 않기 위해 시간 정보를 초기화합니다.

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return dueDate < today;
};
