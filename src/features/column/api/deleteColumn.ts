import { httpClient } from "../../../shared/api/httpClient";

interface RequestDeleteColumn {
  id: string;
}

interface ResponseDeleteColumn {
  success: boolean;
  deleted_cards_count: number;
}

export const deleteColumn = async ({ id }: RequestDeleteColumn) => {
  const response = await httpClient.delete<ResponseDeleteColumn>(`/columns/${id}`);

  return response;
};
