<template>
  <the-navbar/>
  <div class="container">
    <router-view v-show="showPage" @ready="showPage = true" :key="$route.fullPath"/>
    <AppSpinner v-if="!showPage"/>
  </div>
  
</template>

<script>
import { mapState } from 'pinia';
import useForumStore from '@/stores/forumStore';
import theNavbar from '@/components/TheNavbar';

export default {
  name: 'App',
  components: {
    theNavbar,
  },
  data () {
    return {
      showPage: false
    }
  },
  computed: {
    ...mapState(useForumStore, ['forumData']),
  },
  created () {    
    
    this.forumStore.fetchAuthUser();    
    
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
