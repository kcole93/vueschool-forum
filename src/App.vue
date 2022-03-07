<template>
  <the-navbar/>
  <div class="container">
    <router-view/>
  </div>
  
</template>

<script>
import { mapState } from 'pinia';
import {useForumStore} from '@/stores/forumStore';
import theNavbar from '@/components/TheNavbar';

export default {
  name: 'App',
  components: {
    theNavbar,
  },
  computed: {
    ...mapState(useForumStore, ['forumData', 'authUser']),
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
