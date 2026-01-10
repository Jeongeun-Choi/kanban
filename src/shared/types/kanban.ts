export interface Column {
  id: string;
  title: string;
  order: number;
  created_at: string;
}

export interface Card {
  id: string;
  column_id: string;
  title: string;
  description?: string;
  due_date?: string;
  order: number;
  created_at: string;
  updated_at: string;
}
