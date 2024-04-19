<script setup lang="ts">
import { ref } from "vue";
import PlusIcon from "./icons/PlusIcon.vue";
import { useDragAndDrop } from "vue-fluid-dnd";
import { Container } from ".";
const currentCard = ref("");
const { container } = defineProps<{ container: Container }>();

const cards = ref(container.cards);

const addCart = () => {
  if (currentCard.value) {
    container.cards.push(currentCard.value);
    currentCard.value = "";
  }
};
const { parent } = useDragAndDrop(cards);
</script>
<template>
  <div
    class="flex gap-2 flex-col p-2 bg-emerald-200 border-2 border-solid w-64 border-emerald-600 rounded-lg"
  >
    <h2 class="font-bold">{{ container.name }}</h2>
    <div ref="parent" class="flex flex-col gap-1">
      <transition-group
        enter-from-class="opacity-0 translate-y-2"
        leave-to-class="opacity-0 translate-y-2"
        leave-active-class="transition-[transform,_opacity] duration-500 ease"
        enter-active-class="transition-[transform,_opacity] duration-500 ease"
      >
        <div
          v-for="(card, index) in container.cards"
          :index="index"
          :key="card"
        >
          <div class="rounded-lg shadow p-3 bg-lime-50/80 text-left">
            {{ card }}
          </div>
        </div>
      </transition-group>
    </div>

    <textarea
      class="rounded-lg bg-lime-50/80 shadow p-3"
      type="text"
      v-model="currentCard"
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
