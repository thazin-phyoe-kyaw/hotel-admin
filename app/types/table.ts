export interface Column<T> {
  render: any;
  key: keyof T;
  label: string;
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (id: string | number) => void;
  searchPlaceholder?: string;
  name?: string;
  onAdd?: () => void;
}
