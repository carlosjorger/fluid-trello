<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import PlusIcon from "./icons/PlusIcon.vue";
import { useDragAndDrop } from "vue-fluid-dnd";
import { AppData, Container } from ".";
import CustomButton from './CustomButton.vue';
import CardComponent from "./Card.vue";
import DotsIcon from "./icons/DotsIcon.vue";

const { container, appData, removeContainer } = defineProps<{ container: Container, appData: AppData, removeContainer: () => void }>();

const currentCard = ref("");
const cards = ref(container.cards);
const editContainerName = ref(false)
  const emit = defineEmits<{
        (e: 'showEditOptions',
        containerId : number,
        cardText: string, 
        options:{
          deleteCard?:()=>void,
          updateCard?:(cardText:string)=>void
        }): void,
        (e: 'closeEditOptions', containerId : number): void,
        (e: 'saveApp'): void
    }>()
const editingCards = new Map<number, boolean>()

const containerOptions = ref(false)

function addCard(text:string){
  appData.addCardToAContainer(text, (card) =>{
    insertAt(container.cards.length, card);
  })
}
const addCart = () => {
  if (currentCard.value) {
    addCard(currentCard.value)
    currentCard.value = "";
    emit('saveApp')
  }
};
const { parent, removeAt, insertAt } = useDragAndDrop(cards,{
  droppableGroup:'cards',
  droppableClass:'droppable-cards-container',
  insertingFromClass: 'before-insert'
});
const containerMame = useTemplateRef('containerMame')
const observer = ref<MutationObserver>()
const draggingOverContainer=ref(false)
function classMutationCallback(mutationsList : MutationRecord[]){
  for(let mutation of mutationsList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      const target= mutation.target as HTMLElement
      if (target && target.classList.contains('droppable-cards-container')) {
        draggingOverContainer.value = true
      }
      else{
        draggingOverContainer.value = false
      }
    }
  }
} 
function startEditingContainerName(){
   editContainerName.value = true
   if (containerMame.value) {
     containerMame.value.focus()
   }
}
function endEditingContainerName(){
  editContainerName.value = false
}
function closeContainerOptions(){
  containerOptions.value = false
}
function showEditingCard(index:number,cardText: string ,closeCardEdit: () => void,  updateCardEdit:(cardText:string)=>void){
  const value = cards.value[index]
  editingCards.set(value.id, true)
   emit('showEditOptions', container.id, cardText,{
    deleteCard: () => { 
      removeAt(index);
      closeCardEdit();
    },
    updateCard:(cardText:string)=>{
      updateCardEdit(cardText)
    }
  })
}
function closeEditOptions(index:number){
  const value = cards.value[index]
  editingCards.set(value.id, false)
  const editingCardValues = [... editingCards.values()]
  const notEditing = editingCardValues.every(editingCard => !editingCard);
  if (notEditing) {
    emit('closeEditOptions', container.id)
  }
}
onMounted(()=>{
  observer.value = new MutationObserver(classMutationCallback)
  if (parent.value) {
    observer.value.observe(parent.value, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
})
</script>
<template>
  <div
    class="flex gap-2 flex-col p-2 bg-emerald-900 min-w-64 rounded-2xl relative"
  >
  <div class="flex justify-between gap-2">
    <div class="px-2 mt-1 relative min-h-8 w-full" v-clickOutside="endEditingContainerName">
        <textarea
            ref="containerMame"
            :class="{
              'not-editing':!editContainerName
            }"
            class="font-bold resize-none py-1 outline-hidden shadow-[inset_0_0_0_2px_rgba(0,0,0,0.3)] rounded-md shadow-white border-none opacity-100 bg-transparent absolute right-0 left-0 pl-2 max-h-12 transition-[background-color,_border-color,_box-shadow] duration-200" v-model="container.name"/>
          <h2 
            class="font-bold text-left w-full py-1" 
            :hidden="editContainerName"
            @click="startEditingContainerName">
           {{ container.name }}
          </h2>
      </div>
    <button class="p-2 rounded-2xl border-transparent hover:bg-slate-300/40" @click="containerOptions = !containerOptions" v-clickOutside="closeContainerOptions"><dots-icon/></button>
  </div>
  <div class="absolute top-16 left-36 z-20 border-2 rounded-lg" v-if="containerOptions">
    <custom-button class="bg-[#66837d]" @click="removeContainer">Remove</custom-button>
  </div>
  <div ref="parent" class="p-1 rounded-md transition-[color,_background-color,_border-color] min-h-12 card-container">
    <card-component
      v-for="(_, index) in cards"
      :index="index"
      v-model="cards[index].text"
      :key="cards[index].id"
      :draggingOverContainer
      @showEditOptions="(cardText, closeCardEdit,updateCard) => showEditingCard(index, cardText, closeCardEdit, updateCard)"
      @closeEditOptions="() => closeEditOptions(index)"
      class="trello-card"
      />
  </div>

    <textarea
      class="rounded-lg bg-lime-50/80 shadow-sm p-3 resize-none"
      type="text"
      v-model="currentCard"
      placeholder="Add a new cart..."
      autofocus
    />
    <custom-button
      class="hover:bg-white/30 bg-inherit text-white flex gap-5 duration-200 transition-colors border-0"
      v-on:click="addCart"
    >
      <plus-icon /> Add a cart
    </custom-button>
  </div>
</template>
<style>
.droppable-cards-container{
  background-color: rgb(5 150 105);;
}
</style>
<style scoped>
textarea{
  field-sizing: content;
}
.not-editing{
  opacity: 0 !important;
  z-index: -1;
  box-shadow: none !important;
}
.card-container{
  scrollbar-width: thin;
}
.trello-card{
  transition: opacity 125ms ease;
}
.trello-card.before-insert{
  opacity: 0;
}
</style>