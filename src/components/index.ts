export type Container = {
  id:number;
  name: string;
  cards: string[];
};
export type Card = {
  id: number;
  text: string;
}
export const editOptions = "edit-options";