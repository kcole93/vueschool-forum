<template>
  <div class="container">
    <div class="flex-grid">
      <div class="col-3 push-top">
        <UserProfileCard v-if="!edit" :user="user"/>
        <UserProfileCardEditor v-else :user="user"/>
    </div>
      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{user.name }}'s recent activity </span>
          <a href="#">See only started threads?</a>
        </div>
        <hr />
        <PostList :posts="user.postsSorted" />
      </div>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList';
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'

export default {
    components: { PostList, UserProfileCard, UserProfileCardEditor },
    props: {
        edit: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        user () {
            return this.forumStore.authUser;
        },        
    }
};
</script>

<style scoped>
</style>