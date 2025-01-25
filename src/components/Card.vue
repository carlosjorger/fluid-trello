<script setup lang="ts">
    import { ref,defineModel, watch } from 'vue';
    import EditIcon from './icons/EditIcon.vue';
import { editOptions } from '.';

    const emit = defineEmits<{
        (e: 'showEditOptions',show:boolean,closeDropdown: () => void): void
    }>()

    const model = defineModel({ type: String })
    const { draggingOverContainer } = defineProps<{ draggingOverContainer: boolean }>();

    const showEdit = ref(false)
    const editCard = ref(false)
    const cardElement = ref<HTMLElement>();
    function cardEnter(){
        showEdit.value = true;
    }
    function cardLeave(){
        showEdit.value = false;
    }
    const closeDropdown = () => {
        editCard.value = false;
    };
    function startEditingCard(event:MouseEvent){
        editCard.value = true
        const card = (event.currentTarget as Element).parentElement
        if (card) {
            emit('showEditOptions',true, closeDropdown)
        }
    }
    watch(editCard, (value)=>{
        if (value) {
            const editOptionsElement = document.querySelector(`#${editOptions}`) as HTMLElement| undefined
            const cardElementValue = cardElement.value
            if (cardElementValue&& editOptionsElement) {
                const rectCard = cardElementValue.getBoundingClientRect()
                const {top, left, height, width} = rectCard
                editOptionsElement.style.transform = `translate(${left + width}px, ${top - height}px)`
            }
        }
    })
</script>
<template>
    <div 
        class="rounded-lg shadow p-2 m-1 bg-slate-300/40 text-left relative border-2 transition-colors" 
        :class="{
            'border-white' : editCard,
            'border-white/0 hover:border-white' : !editCard,
        }" 
        v-on:mouseenter="cardEnter"  
        v-on:mouseleave="cardLeave" 
        v-clickOutside="closeDropdown"
        ref="cardElement"
        >
        <input v-if="editCard" v-focus v-model="model" class="resize-none outline-none border-none bg-transparent"/>
        <div v-else>{{ model }}</div>
        <Transition>
            <button @click="startEditingCard" v-if="showEdit&&!editCard&&!draggingOverContainer" class="absolute right-1 bg-white/0 top-1 p-1 rounded-full hover:bg-white/10 border-none transition-colors"><edit-icon/></button>
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