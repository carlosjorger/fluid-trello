<script setup lang="ts">
    import { ref,defineModel } from 'vue';
    import EditIcon from './icons/EditIcon.vue';

    const model = defineModel({ type: String })

    const showEdit = ref(false)
    const editCard = ref(false)
    
    function cardEnter(){
        showEdit.value = true;
    }
    function cardLeave(){
        showEdit.value = false;
    }
    const closeDropdown = () => {
        editCard.value = false;
    };
</script>
<template>
    <!-- TODO: avoid to hover is an element is dragged -->
    <div 
        class="rounded-lg shadow p-2 bg-slate-300/40 text-left relative border-2 transition-colors" 
        :class="{
            'border-white' : editCard,
            'border-white/0 hover:border-white' : !editCard
        }" 
        v-on:mouseenter="cardEnter"  
        v-on:mouseleave="cardLeave" 
        v-clickOutside="closeDropdown">
        <input v-if="editCard" v-focus v-model="model" class="resize-none outline-none border-none bg-transparent"/>
        <span v-else>{{ model }}</span>
        <Transition>
            <button @click="editCard=true" v-if="showEdit&&!editCard" class="absolute right-1 bg-white/0 top-1 p-1 rounded-full hover:bg-white/10 border-none transition-colors"><edit-icon/></button>
        </Transition>
    </div>
</template>
<style scoped>
    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.2s ease;
    }
    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
</style>