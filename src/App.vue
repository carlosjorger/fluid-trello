<script setup lang="ts">
import { ref } from "vue";
import CardContainer from "./components/CardContainer.vue";
import { Container, editOptions } from "./components";
import { useDragAndDrop } from "vue-fluid-dnd";
const containers = ref([] as Container[]);
const addingContainer = ref(false);
const showingEditOptions = ref(false);
const deleteCardCommand = ref<()=>void>()

const getEmptyContainer = (): Container => {
  const ids = containers.value.map(({id})=>id);
  const maxId = ids.length == 0? 0 :Math.max(...ids);
  return ({ name: "", cards: [], id: maxId + 1 })
};

const containerToAdd = ref<Container>(getEmptyContainer());
const startAddingContainer = () => {
  if (!addingContainer.value) {
    containerToAdd.value = getEmptyContainer();
  }
  else if(!containerToAdd.value.name){
    return
  } 
  else {
    containers.value.push(containerToAdd.value);
  }
  addingContainer.value = !addingContainer.value;
};
const { parent } = useDragAndDrop(containers, {
  direction: "horizontal"
});
function showEditOptions( 
        show:boolean, 
        options:{
          deleteCard?:()=>void
        }){
  showingEditOptions.value = show
  const { deleteCard } = options
  deleteCardCommand.value = ()=>{
    deleteCard&&deleteCard()
    showingEditOptions.value = false;
  }
            
}
</script>

<template>
  <div v-if="showingEditOptions" :id="editOptions"  class="absolute my-2">
    <button @click="deleteCardCommand">Remove</button>
  </div>
  <div class="flex items-start gap-4 m-8">
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
          :index="index"
          :ref="container.name"
          :key="container.id"
          @showEditOptions="(show,options)=>showEditOptions(show, options)"
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
        class="bg-lime-50/80 shadow text-black rounded-sm px-3 py-1"
        v-model="containerToAdd.name"
        placeholder="Name of the container..."
      />
      <button 
        class="bg-white/25 hover:bg-white/15 transition-colors border-0 w-60" 
        @click="startAddingContainer"
        >
        <span v-if="!addingContainer"> Add another container</span>
        <span v-else>Add container</span>
      </button>
    </div>
  </div>
</template>
<!-- TODO: save on local storage -->
<!-- TODO: add cart delete option --> 
 <style>
/* Define the thumb style */
.fluid-trello-container {
  scrollbar-color: rgb(16 185 129) rgb(6 78 59);
}
</style>