<script setup lang="ts">
    import { ref,defineModel, watch } from 'vue';
    import EditIcon from './icons/EditIcon.vue';
    import { editOptions } from '.';

    const emit = defineEmits<{
        (e: 'showEditOptions',closeDropdown: () => void): void,
        (e: 'closeEditOptions'): void
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
        if (editCard.value) {
            editCard.value = false;
            emit('closeEditOptions');
        }
    };
    function startEditingCard(event:MouseEvent){
        editCard.value = true
        const card = (event.currentTarget as Element).parentElement
        if (card) {
            emit('showEditOptions', closeDropdown)
        }
    }
    function updateOptionsElement(){
        const editOptionsElement = document.querySelector(`#${editOptions}`) as HTMLElement| undefined
            const cardElementValue = cardElement.value
            if (cardElementValue&& editOptionsElement) {
                const rectCard = cardElementValue.getBoundingClientRect()
                const {top, left, width} = rectCard
                editOptionsElement.style.transform = `translate(${left + width}px, ${top - 8}px)`
            }
    }
    watch(editCard, (value)=>{
        if (value) {
            updateOptionsElement()
        }
    })
</script>
<template>
    <div 
        class="shadow m-1 bg-slate-300/40 text-left rounded-lg" 
        v-on:mouseenter="cardEnter"  
        v-on:mouseleave="cardLeave" 
        v-clickOutside="closeDropdown"
        ref="cardElement"
        >
        <div class="p-2 rounded-lg relative border-2 transition-colors" :class="{
            'border-white' : editCard,
            'border-white/0 hover:border-white' : !editCard,
            }" >
            <input v-if="editCard" v-focus v-model="model" class="resize-none outline-none border-none bg-transparent field-sizing-content"/>
            <div v-else>{{ model }}</div>
            <Transition>
                <button @click="startEditingCard" v-if="showEdit&&!editCard&&!draggingOverContainer" class="absolute right-1 bg-white/0 top-1 p-1 rounded-full hover:bg-white/10 border-none transition-colors"><edit-icon/></button>
            </Transition>
        </div>
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