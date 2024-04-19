<script setup lang="ts">
import { ref } from "vue";
import CardContainer from "./components/CardContainer.vue";
import { Container } from "./components";
// import { useDragAndDrop } from "vue-fluid-dnd";

const containers = ref([] as Container[]);
const addingContainer = ref(false);
const getEmptyContainer = (): Container => ({ name: "", cards: [] });

const containerToAdd = ref<Container>(getEmptyContainer());
const startAddingContainer = () => {
  if (!addingContainer.value) {
    containerToAdd.value = getEmptyContainer();
  } else {
    containers.value.push(containerToAdd.value);
  }
  addingContainer.value = !addingContainer.value;
};
// const { parent } = useDragAndDrop(containers, {
//   direction: "horizontal",
// });
</script>

<template>
  <div class="flex items-start gap-4">
    <div ref="parent" class="flex items-start gap-4">
      <card-container
        v-for="(container, index) in containers"
        :container
        :index="index"
        :ref="container.name"
      />
    </div>
    <div
      class="flex flex-col bg-emerald-200 border-emerald-600 rounded-lg"
      :class="{
        'p-4 gap-3': addingContainer,
      }"
    >
      <input
        v-if="addingContainer"
        type="text"
        class="bg-lime-50/80"
        v-model="containerToAdd.name"
      />
      <button @click="startAddingContainer">
        <span v-if="!addingContainer"> Add another container</span>
        <span v-else>Add container</span>
      </button>
    </div>
  </div>
</template>
