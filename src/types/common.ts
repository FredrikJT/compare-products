export interface Item {
  name: string;
  type: string;
  quantity: number;
  price?: number;
  failureRate?: number;
  description?: string;
  parent?: string;
}

export interface CompareProductItem {
  name: string;
  type: string;
  quantity: number;
  price: number;
  failureRate: number;
  description: string;
  parentName?: string | null;
  children: CompareProductItem[];
  parent?: CompareProductItem;
  get totalCost(): number;
}
