import { httpClient } from "../../../shared/api/httpClient";
import type { Column } from "../../../shared/types/kanban";

interface RequestCreateColumn {
  title?: string;
}

export const createColumn = async (body: RequestCreateColumn) => {
  const response = await httpClient.post<Column>("/columns", body);
  return response;
};
