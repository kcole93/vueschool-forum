import HomeView from '@/pages/HomeView'
import ThreadShow from '@/pages/ThreadShow'
import NotFound from '@/pages/NotFound'
import ForumShow from '@/pages/ForumShow'
import CategoryShow from '@/pages/CategoryShow'
import { createRouter, createWebHistory } from 'vue-router'
import sourceData from '@/data.json'
import ProfileShow from '@/pages/ProfileShow'
import ThreadCreate from '@/pages/ThreadCreate'
import ThreadEdit from '@/pages/ThreadEdit'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/me',
        name: 'ProfileShow',
        component: ProfileShow,
        meta: {toTop: true, smoothScroll: true}
    },
    {
        path: '/me/edit',
        name: 'ProfileEdit',
        component: ProfileShow,
        props: {
            edit: true
        }
    },
    {
        path: '/thread/:id',
        name: 'ThreadShow',
        component: ThreadShow,
        props: true,
        beforeEnter (to, from, next) {
            // check if thread exists
            const threadExists = sourceData.threads.find(thread => thread.id === to.params.id)
            // if exists continue, otherwise redirect to NotFound
            if (threadExists) {
              return next()
            } else {
              next({
                name: 'NotFound',
                params: { pathMatch: to.path.substring(1).split('/') },
                // preserve existing query and hash values in url
                query: to.query,
                hash: to.hash
              })
            }
          }
    },
    {
        path: '/forum/:forumId/thread/create',
        name: 'ThreadCreate',
        component: ThreadCreate,
        props: true,
    },
    {
        path: '/thread/:id/edit',
        name: 'ThreadEdit',
        component: ThreadEdit,
        props: true
    },
    {
        path: '/categories/:id',
        name: 'CategoryShow',
        props: true,
        component: CategoryShow
    },
    {
        path: '/forum/:id',
        name: 'ForumShow',
        component: ForumShow,
        props: true,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

export default createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to){
        const scroll = {}
        if (to.meta.toTop) scroll.top = 0
        if (to.meta.smoothScroll) scroll.behavior = 'smooth'
        return scroll
    }
})
