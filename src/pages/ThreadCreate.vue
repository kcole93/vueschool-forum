<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor @save="save" @cancel="cancel" @dirty="formIsDirty = true" @clean="formIsDirty =  false" />
  </div>
  
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor.vue';
import { findById } from '@/helpers';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
    components: {
      ThreadEditor,
    },
    mixins: [asyncDataStatus],
    props: {
        forumId: {type: String, required: true},
    },
    data () {
      return {
        formIsDirty: false
      }
    },
    computed: {
        forum() {
            return findById(this.forumsStore.items, this.forumId) || {}
        }
    },
    methods: {
        async save ({ title, text}) {
           const thread = await this.threadsStore.createThread({
                forumId: this.forumId,
                title,
                text
        });
        this.$router.push({name: 'ThreadShow', params: { id: thread.id }});
    },
    cancel () {
        this.$router.push({name: 'ForumShow', params: { id: this.forumId }});
    }
},
async beforeCreate () {
 await this.forumsStore.fetchForum(this.forumId);
 this.asyncDataStatus_fetched();
},
beforeRouteLeave(){
  
  if(this.formIsDirty){
    const confirmed = window.confirm('Are you sure you want to leave this page? Unsaved changes will be lost!')

    if(!confirmed) return false
  }   

},
}
</script>

<style scoped>

</style>