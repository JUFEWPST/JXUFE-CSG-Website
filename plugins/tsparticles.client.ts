import { defineNuxtPlugin } from '#app';
import VueParticles from '@tsparticles/vue3';
import { loadSlim } from '@tsparticles/slim';


export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueParticles, {
        init: async (engine) => {
            await loadSlim(engine);

        },
    });
});