<script setup lang="ts">
import { ref } from "vue";
import PlusIcon from "./icons/PlusIcon.vue";
import { useDragAndDrop } from "vue-fluid-dnd";
const todos = ref([] as string[]);
const currentTodo = ref("");
const addCart = () => {
  if (currentTodo.value) {
    todos.value.push(currentTodo.value);
    currentTodo.value = "";
  }
};
const { parent } = useDragAndDrop(todos);
</script>
<template>
  <div
    class="flex gap-2 flex-col p-2 bg-emerald-200 border-2 border-solid w-64 border-emerald-600 rounded-lg"
  >
    <h2 class="font-bold">TODOs</h2>
    <div ref="parent" class="flex flex-col gap-1">
      <div v-for="(todo, index) in todos" :index="index">
        <div class="rounded-lg shadow p-3 bg-lime-50/80 text-left">
          {{ todo }}
        </div>
      </div>
    </div>

    <textarea
      class="rounded-lg bg-lime-50/80 shadow p-3"
      type="text"
      v-model="currentTodo"
      placeholder="Add a new cart..."
      autofocus
    />
    <button
      class="hover:bg-emerald-900 bg-emerald-800 rounded text-white flex gap-5 duration-200 transition-colors border-0"
      v-on:click="addCart"
    >
      <plus-icon /> Add a cart
    </button>
  </div>
</template>
