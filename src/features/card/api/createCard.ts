import { httpClient } from "../../../shared/api/httpClient";
import type { Card } from "../../../shared/types/kanban";

interface RequestCreateCard {
  column_id: string;
  title: string;
  description: string;
  due_date: string | null;
}

export const createCard = async (body: RequestCreateCard) => {
  const response = await httpClient.post<Card>(`/cards`, body);

  return response;
};
