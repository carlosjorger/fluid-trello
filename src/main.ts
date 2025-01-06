import { createApp, DirectiveBinding } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.directive('clickOutside',{
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
})
app.directive('focus',{
     mounted: (el:HTMLElement) => el.focus()
})
app.mount('#app')