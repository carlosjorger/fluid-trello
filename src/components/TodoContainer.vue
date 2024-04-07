<script setup lang="ts">
import { ref } from "vue";
import PlusIcon from "./icons/PlusIcon.vue";
import { useDragAndDrop } from "vue-fluid-dnd";
const todos = ref([] as string[]);
const currentTodo = ref("");
const addCart = () => {
  if (currentTodo.value) {
    todos.value.push(currentTodo.value);
  }
};
const { parent } = useDragAndDrop(todos);
</script>
<template>
  <div
    class="flex gap-2 flex-col p-2 bg-gray-100 border-2 border-solid w-64 border-slate-600 rounded-lg"
  >
    <h2>TODOs</h2>
    <div ref="parent" class="flex flex-col gap-1">
      <div v-for="(todo, index) in todos" :index="index">
        <div class="rounded-md shadow-md p-3 bg-gray-50 text-left">
          {{ todo }}
        </div>
      </div>
    </div>

    <textarea
      class="rounded-md shadow-md p-3"
      type="text"
      v-model="currentTodo"
    />
    <button
      class="hover:bg-slate-300 flex gap-5 duration-200 transition-colors border-0"
      v-on:click="addCart"
    >
      <plus-icon /> Add a cart
    </button>
  </div>
</template>
