<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.id" class="post">
      <div v-if="userById(post.userId)" class="user-info">
        <a href="#" class="user-name">{{ userById(post.userId).name }}</a>

        <a href="#">
          <img
            class="avatar-large"
            :src="userById(post.userId).avatar"
            alt=""
          />
        </a>

        <p class="desktop-only text-small">
          {{ userById(post.userId).postsCount }} posts
        </p>
        <p class="desktop-only text-small">
          {{ userById(post.userId).threadsCount }} threads
        </p>
      </div>

      <div class="post-content">
        <div class="col-full">
          <PostEditor
            v-if="editing === post.id"
            :post="post"
            @save="handleUpdate"
            @dirty="postIsDirty = true"
            @clean="postIsDirty = false"
          
          />
          <p v-else>{{ post.text }}</p>
        </div>
        <a
          v-if="post.userId === forumStore.authId"
          @click.prevent="toggleEditMode(post.id)"
          href="#"
          style="margin-left: auto; padding-left: 10px"
          class="link-unstyled"
          :title="editing != post.id ? 'Make a change' : 'Discard changes'"
        >
          <fa-icon v-if="editing != post.id" icon="pen-to-square" />
          <fa-icon v-else icon="square-xmark" />
        </a>
      </div>
      <div class="post-date text-faded">
        <div v-if="post.edited?.at" class="edition-info">edited</div>
        <app-date :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>

<script>
import PostEditor from '@/components/PostEditor.vue'
export default {
  components: {
    PostEditor,
  },
  props: {
    posts: {
      required: true,
      type: Array,
    },
  },
  data () {
    return {
      editing: null,
      postIsDirty: false
      }
  },
  methods: {
    userById(userId) {
      return this.forumStore.user(userId);
    },
    toggleEditMode(id) {
      this.editing = id === this.editing ? null : id
    },
    handleUpdate(event) {
      this.forumStore.updatePost(event.post.text, event.post.id)
      this.editing = null

    }
  },
  created () {
    this.$emit('ready')
  },
  beforeRouteLeave(){
    if(this.postIsDirty){
    const confirmed = window.confirm('Are you sure you want to leave this page? Unsaved changes will be lost!')

    if(!confirmed) return false
  }   
  },
};
</script>

<style>
</style>