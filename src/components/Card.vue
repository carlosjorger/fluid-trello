<script setup lang="ts">
    import { DirectiveBinding, ref,defineModel } from 'vue';
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
    const vClickOutside = {
            beforeMount:(el:any, binding:DirectiveBinding)=>{
                // do something
                el.clickOutsideEvent = function(event:MouseEvent) {
                    // Check if the clicked element is neither the element
                    // to which the directive is applied nor its child
                    if (!(el === event.target || el.contains(event.target))) {
                        // Invoke the provided method
                        binding.value(event);
                    }
                };
                document.addEventListener('click', el.clickOutsideEvent);
            },
            unmounted(el:any) {
                // Remove the event listener when the bound element is unmounted
                document.removeEventListener('click', el.clickOutsideEvent);
            },
        };
    const vFocus = {
        mounted: (el:HTMLElement) => el.focus()
    }
    const closeDropdown = () => {
        editCard.value = false;
    };
</script>
<template>
    <div class="rounded-lg shadow p-3 bg-slate-300/40 text-left relative" v-on:mouseenter="cardEnter"  v-on:mouseleave="cardLeave" v-click-outside="closeDropdown">
        <input  v-if="editCard" v-focus v-model="model" class="resize-none outline-none border-none bg-transparent"/>
        <span v-else>{{ model }}</span>
        <Transition>
            <button @click="editCard=true" v-if="showEdit&&!editCard" class="absolute right-1 bg-white/0 top-1 p-2 rounded-full hover:bg-white/10 border-none transition-colors"><edit-icon/></button>
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