<template>
  <the-navbar/>
  <div class="container">
    <router-view v-show="showPage" @ready="showPage = true" :key="$route.fullPath"/>
    <AppSpinner v-if="!showPage"/>
    <AppNotifications/>
  </div>
  
</template>

<script>
import { mapStores } from 'pinia';
import useAuthStore from '@/stores/authStore';
import useRootStore from '@/stores/rootStore';
import { usePostsStore } from '@/stores/postsStore';
import { useThreadsStore } from './stores/threadsStore';
import { useUsersStore } from './stores/usersStore';
import { useForumsStore } from './stores/forumsStore';
import { useCategoriesStore } from './stores/categoriesStore';
import theNavbar from '@/components/TheNavbar';
import AppNotifications from '@/components/AppNotifications.vue';

export default {
  name: 'App',
  components: {
    theNavbar,
    AppNotifications,
  },
  data () {
    return {
      showPage: false
    }
  },
  computed: {
    ...mapStores(useRootStore,useAuthStore, usePostsStore, useThreadsStore, useUsersStore, useForumsStore, useCategoriesStore)
  },
  created () {    
    
    this.authStore.fetchAuthUser();    
    
    // Reset showPage to false before each router navigation
    this.$router.beforeEach(() => {
      this.showPage = false;
    })
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
