import { httpClient } from "../../../shared/api/httpClient";

export const deleteCard = async (cardId: string) => {
  const response = await httpClient.delete<{ success: boolean }>(`/cards/${cardId}`);
  return response;
};
