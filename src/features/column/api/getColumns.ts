import { httpClient } from "../../../shared/api/httpClient";
import type { Column } from "../../../shared/types/kanban";

export const getColumns = async () => {
  const response = await httpClient.get<Column[]>("/columns");

  return response;
};
