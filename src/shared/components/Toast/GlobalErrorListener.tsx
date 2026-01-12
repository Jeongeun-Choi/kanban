import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../hooks/useToast";

export default function GlobalErrorListener() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const manualRetryKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribeQuery = queryClient.getQueryCache().subscribe((event) => {
      const queryKeyString = JSON.stringify(event.query.queryKey);

      if (event.type === "updated" && event.action.type === "error") {
        const error = event.action.error as Error;
        const isNetworkError = !navigator.onLine || error.message.includes("Failed to fetch");
        const hasBeenRetried = manualRetryKeys.current.has(queryKeyString);

        if (isNetworkError && !hasBeenRetried) {
          // 네트워크 에러이면서 아직 재시도 전인 경우에만 재시도 버튼 제공
          showToast("네트워크 연결이 불안정합니다. 연결 상태를 확인해 주세요.", "error", {
            action: {
              label: "다시 요청",
              onClick: () => {
                manualRetryKeys.current.add(queryKeyString);
                queryClient.refetchQueries({ queryKey: event.query.queryKey });
              },
            },
            duration: 0,
          });
        } else if (isNetworkError && hasBeenRetried) {
          // 네트워크 에러 재시도 실패
          showToast("네트워크 연결에 다시 실패했습니다.", "error");
          manualRetryKeys.current.delete(queryKeyString);
        } else {
          // 일반 서비스 에러 (버튼 없음)
          showToast(error.message || "오류가 발생했습니다.", "error");
        }
      }

      if (event.type === "updated" && event.action.type === "success") {
        manualRetryKeys.current.delete(queryKeyString);
      }
    });

    const unsubscribeMutation = queryClient.getMutationCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        const error = event.action.error as Error;
        const isNetworkError = !navigator.onLine || error.message.includes("Failed to fetch");

        if (isNetworkError) {
          showToast("네트워크 연결이 오프라인 상태입니다.", "error");
        } else {
          showToast(error.message || "요청 처리 중 오류가 발생했습니다.", "error");
        }
      }
    });

    return () => {
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [queryClient, showToast]);

  return null;
}
