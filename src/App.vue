<template>
  <div class="container">
    <router-view/>
  </div>
  
</template>

<script>
import { mapState } from 'pinia';
import {useForumStore} from '@/stores/forumStore';

export default {
  name: 'App',
  components: {
  },
  computed: {
    ...mapState(useForumStore, ['forumData'])
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
