<script setup lang="ts">
import { ref, watch } from "vue";
import CardContainer from "./components/CardContainer.vue";
import { AppData, Container, editOptions } from "./components";
import { useDragAndDrop } from "vue-fluid-dnd";
import CustomButton from './components/CustomButton.vue';

const appData = ref(new AppData())
const containers = ref(appData.value.containers);
const addingContainer = ref(false);
const showingEditOptions = ref(false);
const editOptionsContainer = ref<number>();
const currentEditingCardText = ref('')
const deleteCardCommand = ref<()=>void>()
const updateCardCommand = ref<(cardText:string)=>void>()
const containerToAdd = ref<Container>(appData.value.getEmptyContainer());


function saveApp(){
  appData.value.saveInLocalStorage()
}
const startAddingContainer = () => {
  if (!addingContainer.value) {
    containerToAdd.value = appData.value.getEmptyContainer();
  }
  else if(!containerToAdd.value.name){
    return
  } 
  else {
    appData.value.addContainer(containerToAdd.value)
    saveApp();
  }
  addingContainer.value = !addingContainer.value;
};
const { parent } = useDragAndDrop(containers, {
  direction: "horizontal"
});
document.addEventListener('DOMContentLoaded',()=>{
  containers.value = appData.value.loadLocalStorage()
})
function closeEditOptions(containerId:number){
  if (containerId == editOptionsContainer.value) {
    showingEditOptions.value = false;
    updateCardCommand.value
    &&updateCardCommand.value(currentEditingCardText.value)
  }
}
function showEditOptions( 
  containerId:number,
  cardText: string,
  options:{
    deleteCard?:()=>void,
    updateCard?:(cardText:string)=>void
  }){
  editOptionsContainer.value = containerId
  showingEditOptions.value = true
  currentEditingCardText.value = cardText

  const { deleteCard, updateCard } = options
  deleteCardCommand.value = ()=>{
    deleteCard&&deleteCard()
    if (editOptionsContainer.value) {
      closeEditOptions(editOptionsContainer.value)
    }
  }
  updateCardCommand.value = (cardText:string)=>{
    updateCard&&updateCard(cardText)
  }         
}
watch(containers,()=>{
  saveApp()
},{ deep:true});
</script>

<template>
  <div v-if="showingEditOptions" class="bg-[hsla(0,_0%,_0%,_0.6)] h-screen fixed top-0 bottom-0 left-0 right-0 z-10">
    <div :id="editOptions" class="m-2 w-fit flex gap-2">
        <input id="editing-card" v-focus type="text" class="border-white border-2 rounded-lg p-2" v-model="currentEditingCardText"> 
        <custom-button class="bg-[#66837d]" @click="deleteCardCommand">Remove</custom-button>
      </div>
  </div>
  <div class="flex items-start gap-4 p-8">
    <div ref="parent"  class="flex items-start gap-4 w-full overflow-x-auto fluid-trello-container py-2">
      <transition-group
        name="containers"
        enter-from-class="opacity-0 -translate-x-2"
        leave-to-class="opacity-0 -translate-x-2"
        leave-active-class="transition-[transform,_opacity] duration-500 ease"
        enter-active-class="transition-[transform,_opacity] duration-500 ease"
      >
        <card-container
          v-for="(container, index) in containers"
          :container
          :app-data
          :index="index"
          :ref="container.name"
          :key="container.id"
          @showEditOptions="(containerId, cardText, options)=>showEditOptions(containerId, cardText, options)"
          @close-edit-options="(containerId)=>closeEditOptions(containerId)"
          @save-app="saveApp()"
        />
      </transition-group>
    </div>
    <div
      class="flex flex-col bg-emerald-900 border-emerald-600 rounded-lg transition-[padding,_gap] duration-200 ease-in"
      :class="{
        'p-4 gap-2': addingContainer,
      }"
    >
      <input
        v-if="addingContainer"
        type="text"
        class="bg-lime-50/80 shadow-sm text-black rounded-xs px-3 py-1"
        v-model="containerToAdd.name"
        placeholder="Name of the container..."
      />
      <custom-button 
        class="bg-white/25 hover:bg-white/15 transition-colors border-0 w-60" 
        @click="startAddingContainer"
        >
        <span v-if="!addingContainer"> Add another container</span>
        <span v-else>Add container</span>
      </custom-button>
    </div>
  </div>
</template>
<!-- TODO: save on local storage -->
 <style>
/* Define the thumb style */
.fluid-trello-container {
  scrollbar-color: rgb(16 185 129) rgb(6 78 59);
}
</style>