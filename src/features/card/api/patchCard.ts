import { httpClient } from "../../../shared/api/httpClient";
import type { Card } from "../../../shared/types/kanban";

interface RequestUpdateCard {
  title?: string;
  description?: string;
  due_date?: string | null;
}

export const updateCard = async (cardId: string, body: RequestUpdateCard) => {
  const response = await httpClient.patch<Card>(`/cards/${cardId}`, body);
  return response;
};
