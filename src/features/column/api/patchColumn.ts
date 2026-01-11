import { httpClient } from "../../../shared/api/httpClient";
import type { Column } from "../../../shared/types/kanban";

interface RequestUpdateColumn {
  title?: string;
  order?: number;
}

export const updateColumn = async (columnId: string, body: RequestUpdateColumn) => {
  const response = await httpClient.patch<Column>(`/columns/${columnId}`, body);
  return response;
};
