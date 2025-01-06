<script setup lang="ts">
import { ref } from "vue";
import PlusIcon from "./icons/PlusIcon.vue";
import { useDragAndDrop } from "vue-fluid-dnd";
import { Container } from ".";
import Card from "./Card.vue";

const { container } = defineProps<{ container: Container }>();
const currentCard = ref("");

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
    class="flex gap-2 flex-col p-2 bg-emerald-900 w-64 rounded-2xl"
  >
    <h2 class="font-bold">{{ container.name }}</h2>
    <div ref="parent" class="flex flex-col gap-1">
      <card
        v-for="(_, index) in cards"
        :index="index"
        v-model="cards[index]"
        >
      </card>
    </div>

    <textarea
      class="rounded-lg bg-lime-50/80 shadow p-3 resize-none"
      type="text"
      v-model="currentCard"
      placeholder="Add a new cart..."
      autofocus
    />
    <button
      class="hover:bg-white/30 bg-inherit rounded text-white flex gap-5 duration-200 transition-colors border-0"
      v-on:click="addCart"
    >
      <plus-icon /> Add a cart
    </button>
  </div>
</template>
