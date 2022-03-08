import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import { useForumStore } from '@/stores/forumStore'
import firebase from 'firebase'
import firebaseConfig from '@/config/firebase'

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const pinia = createPinia()
const forumApp = createApp(App)

const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    const baseComponentName = baseComponentConfig.name || (
      fileName
        .replace(/^.+\//, '')
        .replace(/\.\w+$/, '')
    )
    forumApp.component(baseComponentName, baseComponentConfig)
})

forumApp.use(pinia)
forumApp.config.globalProperties.forumStore = useForumStore();
forumApp.use(router)
forumApp.mount('#app')
