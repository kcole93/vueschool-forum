import HomeView from '@/pages/HomeView'
import ThreadShow from '@/pages/ThreadShow'
import NotFound from '@/pages/NotFound'
import ForumShow from '@/pages/ForumShow'
import CategoryShow from '@/pages/CategoryShow'
import { createRouter, createWebHistory } from 'vue-router'
import sourceData from '@/data.json'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
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
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})
