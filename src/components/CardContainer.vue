<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import PlusIcon from "./icons/PlusIcon.vue";
import { useDragAndDrop } from "vue-fluid-dnd";
import { Container } from ".";
import Card from "./Card.vue";

const { container } = defineProps<{ container: Container }>();

const currentCard = ref("");
const cards = ref(container.cards);
const editContainerName = ref(false)
  const emit = defineEmits<{
        (e: 'showEditOptions',
        containerId : number, 
        options:{
          deleteCard?:()=>void
        }): void,
        (e: 'closeEditOptions', containerId : number): void
    }>()
const editingCards = new Map<number, boolean>()
 function addCard(text:string){
    const ids = container.cards.map(({id})=>id);
    const maxId = ids.length == 0? 0 :Math.max(...ids);
    container.cards.push({
      id: maxId +1,
      text
    })
  }
const addCart = () => {
  if (currentCard.value) {
    addCard(currentCard.value)
    currentCard.value = "";
  }
};
const { parent, removeAt } = useDragAndDrop(cards,{
  droppableGroup:'cards',
  droppableClass:'droppable-cards-container'
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
function showEditingCard(index:number, closeCardEdit: () => void){
  const value = cards.value[index]
  editingCards.set(value.id, true)
   emit('showEditOptions', container.id, {
    deleteCard: () => { 
      removeAt(index);
      closeCardEdit();
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
    class="flex gap-2 flex-col p-2 bg-emerald-900 min-w-64 rounded-2xl"
  >
  <div class="px-2 mt-1 relative min-h-8" v-clickOutside="endEditingContainerName">
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
  <div ref="parent" class="p-1 rounded-md transition-[color,_background-color,_border-color,_min-height] min-h-6 ease-in duration-200 overflow-auto max-h-52 card-container">
    <card
      v-for="(_, index) in cards"
      :index="index"
      v-model="cards[index].text"
      :key="cards[index].id"
      :draggingOverContainer
      @showEditOptions="(closeCardEdit)=>showEditingCard(index,closeCardEdit)"
      @closeEditOptions="() => closeEditOptions(index)"
      >
    </card>
  </div>

    <textarea
      class="rounded-lg bg-lime-50/80 shadow-sm p-3 resize-none"
      type="text"
      v-model="currentCard"
      placeholder="Add a new cart..."
      autofocus
    />
    <button
      class="hover:bg-white/30 bg-inherit rounded-sm text-white flex gap-5 duration-200 transition-colors border-0"
      v-on:click="addCart"
    >
      <plus-icon /> Add a cart
    </button>
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
</style>