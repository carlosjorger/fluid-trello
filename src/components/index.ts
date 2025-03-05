const fluidTrelloKey='fluid-trello-key'
export class AppData{
  containers: Container[]
  constructor(){
    this.containers = []
    this.loadLocalStorage()
  }
  saveInLocalStorage(){
    localStorage.setItem(fluidTrelloKey, JSON.stringify(this))
  }
  loadLocalStorage(){
    const appData = localStorage.getItem(fluidTrelloKey);
    if (appData) {
      const {containers} = JSON.parse(appData) as {containers: Container[]};
      this.containers = containers
      return containers
    }
    return []
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
  constructor(id:number, name: string='', cards: Card[] = []) {
    this.id = id;
    this.name = name;
    this.cards = cards;
  }
  parse(containerObjectString: string){
    const container = JSON.parse(containerObjectString) as { id: number; name: string; cards: Card[];}
    return new Container(container.id, container.name, container.cards)
  } 
};
export type Card = {
  id: number;
  text: string;
}
export const editOptions = "edit-options";