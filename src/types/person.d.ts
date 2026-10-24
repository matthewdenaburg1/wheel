interface Person {
  id: number;
  name: string;
  enabled: boolean;
  order?: number; // round robin order
}
