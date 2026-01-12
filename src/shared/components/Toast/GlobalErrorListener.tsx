import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../hooks/useToast";
import { isNetworkError } from "../../utils/network";
import { BUTTON_LABELS, ERROR_MESSAGES } from "../../constants/index";

export default function GlobalErrorListener() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const manualRetryKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribeQuery = queryClient.getQueryCache().subscribe((event) => {
      const queryKeyString = JSON.stringify(event.query.queryKey);

      if (event.type === "updated" && event.action.type === "error") {
        const error = event.action.error;
        const netError = isNetworkError(error);
        const hasBeenRetried = manualRetryKeys.current.has(queryKeyString);

        if (netError && !hasBeenRetried) {
          showToast(ERROR_MESSAGES.NETWORK_UNSTABLE, "error", {
            action: {
              label: BUTTON_LABELS.RETRY,
              onClick: () => {
                manualRetryKeys.current.add(queryKeyString);
                queryClient.refetchQueries({ queryKey: event.query.queryKey });
              },
            },
            duration: 0,
          });
        } else if (netError && hasBeenRetried) {
          showToast(ERROR_MESSAGES.NETWORK_RETRY_FAILED, "error");
          manualRetryKeys.current.delete(queryKeyString);
        } else {
          showToast((error as Error).message || ERROR_MESSAGES.DEFAULT_ERROR, "error");
        }
      }

      if (event.type === "updated" && event.action.type === "success") {
        manualRetryKeys.current.delete(queryKeyString);
      }
    });

    const unsubscribeMutation = queryClient.getMutationCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        const error = event.action.error;
        if (isNetworkError(error)) {
          showToast(ERROR_MESSAGES.OFFLINE, "error");
        } else {
          showToast((error as Error).message || ERROR_MESSAGES.MUTATION_ERROR, "error");
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
