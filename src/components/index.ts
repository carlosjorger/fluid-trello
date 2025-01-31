export class Container {
  id:number;
  name: string;
  cards: Card[];
  constructor(id:number) {
    this.id = id;
    this.name = '';
    this.cards = []
  }

};
export type Card = {
  id: number;
  text: string;
}
export const editOptions = "edit-options";