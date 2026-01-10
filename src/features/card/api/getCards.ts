import { httpClient } from "../../../shared/api/httpClient";
import type { Card } from "../../../shared/types/kanban";

export const getCards = async (columnId: string) => {
  const response = await httpClient.get<Card[]>(`/cards?column_id=${columnId}`);
  return response;
};
