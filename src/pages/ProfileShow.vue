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
        <AppInfiniteScrollVue
          @load="fetchUserPosts"
          :done="user.posts.length === user.postsCount"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList';
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'
import asyncDataStatus from '@/mixins/asyncDataStatus';
import AppInfiniteScrollVue from '@/components/AppInfiniteScroll.vue';

export default {
    components: { PostList, UserProfileCard, UserProfileCardEditor, AppInfiniteScrollVue },
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
        lastPostFetched(){
          if(this.user.posts.length === 0)return null
          return this.user.posts[this.user.posts.length - 1]
        },       
    },
    methods: {
      fetchUserPosts(){
        return this.forumStore.fetchAuthUsersPosts({ startAfter: this.lastPostFetched })
      }
    },
    async created () {
      await this.fetchUserPosts();
      this.asyncDataStatus_fetched();
    }
};
</script>

<style scoped>
</style>