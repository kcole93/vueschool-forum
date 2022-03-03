<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>
        
    <post-list :posts="threadPosts"/>
    <post-editor @save="addPost"/>
  </div>
</template>

<script>
import PostList from '@/components/PostList';
import PostEditor from '@/components/PostEditor.vue';

export default {
  components: {
    PostList,
    PostEditor,
  },
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    threads () {
      return this.forumStore.forumData.threads;
    },
    posts () {
      return this.forumStore.forumData.posts;
    },
    thread() {
      return this.threads.find((thread) => thread.id === this.id);
    },
    threadPosts() {
      return this.posts.filter(post => post.threadId === this.id);
    },
  },
  methods: {
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.forumStore.createPost(post);
    }
  }
};
</script>

<style scoped>
</style>