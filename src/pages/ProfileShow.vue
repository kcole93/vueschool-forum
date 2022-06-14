<template>
  <div class="container" style="width: 100vw">
    <div class="flex-grid">
      <div class="col-3 push-top">
        <UserProfileCard v-if="!edit" :user="user"/>
        <UserProfileCardEditor v-else :user="user"/>
    </div>
      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{ user.name }}'s recent activity </span>
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
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
    components: { PostList, UserProfileCard, UserProfileCardEditor, },
    mixins: [asyncDataStatus],
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
    },
    async created () {
      await this.forumStore.fetchAuthUsersPosts();
      this.asyncDataStatus_fetched();
    }
};
</script>

<style scoped>
</style>