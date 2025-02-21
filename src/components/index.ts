export class AppData{
  containers: Container[]
  constructor(){
    this.containers = []
  }
  getEmptyContainer = (): Container => {
    const ids = this.containers.map(({id})=>id);
    const maxId = ids.length == 0? 0 :Math.max(...ids);
    return (new Container(maxId + 1 ))
  };
 addContainer(container:Container){
  this.containers.push(container)
 }
 addCardToAContainer( text: string, insertIntoContainer: (card: Card)=> void){
    let maxId = 0;
    for (const container of this.containers) {
      const ids = container.cards.map(({id})=>id);
      const maxContainerId = ids.length == 0? 0 :Math.max(...ids);
      maxId = Math.max(maxId, maxContainerId)
    }
    insertIntoContainer({
      id: maxId + 1,
      text
    })
  }
}
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