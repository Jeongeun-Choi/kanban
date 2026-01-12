export const ERROR_MESSAGES = {
  NETWORK_UNSTABLE: "네트워크 연결이 불안정합니다. 연결 상태를 확인해 주세요.",
  NETWORK_RETRY_FAILED: "네트워크 연결에 다시 실패했습니다.",
  OFFLINE: "네트워크 연결이 오프라인 상태입니다.",
  DEFAULT_ERROR: "오류가 발생했습니다.",
  DATA_LOAD_ERROR: "데이터를 불러오는 중 오류가 발생했습니다.",
  MUTATION_ERROR: "요청 처리 중 오류가 발생했습니다.",
  TITLE: "오류 발생",
} as const;

export const TOAST_MESSAGES = {
  SUCCESS: "성공적으로 처리되었습니다.",
} as const;
