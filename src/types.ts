export type ActiveTab = "tester" | "schema" | "code" | "flutter" | "architecture" | "supabase";

export interface EndpointSpec {
  id: string;
  category: "Auth" | "User" | "Mutual Funds" | "Goals" | "Portfolio" | "Watchlist" | "Content & Config";
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  requiresAuth?: boolean;
  defaultQueryParams?: Record<string, string>;
  defaultBody?: any;
}

export interface SchemaTableColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
  references?: string;
  description: string;
}

export interface SchemaTable {
  tableName: string;
  category: string;
  description: string;
  columns: SchemaTableColumn[];
}

export interface SourceTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: SourceTreeNode[];
  size?: number;
}
