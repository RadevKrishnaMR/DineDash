// types.ts
export interface Table {
  id: number;
  status: 'occupied' | 'vacant' | 'reserved';
  customers: number;
  order: string | null;
  time: string | null;
}
