import { httpClient } from "../../../shared/api/httpClient";
import type { Card } from "../../../shared/types/kanban";

interface MoveCardRequest {
  target_column_id: string;
  new_order: number;
}

export const moveCard = async (cardId: string, body: MoveCardRequest) => {
  const response = await httpClient.patch<Card>(`/cards/${cardId}/move`, body);
  return response;
};
