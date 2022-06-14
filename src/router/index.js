import HomeView from '@/pages/HomeView'
import ThreadShow from '@/pages/ThreadShow'
import NotFound from '@/pages/NotFound'
import ForumShow from '@/pages/ForumShow'
import CategoryShow from '@/pages/CategoryShow'
import {
    createRouter,
    createWebHistory
} from 'vue-router'
import ProfileShow from '@/pages/ProfileShow'
import ThreadCreate from '@/pages/ThreadCreate'
import ThreadEdit from '@/pages/ThreadEdit'
import RegistrationShow from '@/pages/RegistrationShow'
import SignInShow from '@/pages/SignInShow'
import {
    findById
} from '@/helpers'
import {
    useForumStore
} from '@/stores/forumStore'


const routes = [{
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/me',
        name: 'ProfileShow',
        component: ProfileShow,
        meta: {
            toTop: true,
            smoothScroll: true,
            requiresAuth: true
        },
        children: [{
            path: 'nested'
        }]
    },
    {
        path: '/me/edit',
        name: 'ProfileEdit',
        component: ProfileShow,
        props: {
            edit: true
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/thread/:id',
        name: 'ThreadShow',
        component: ThreadShow,
        props: true,
        async beforeEnter(to, from, next) {
            // check if thread exists
            const forumStore = useForumStore();
            await forumStore.fetchThread(to.params.id);
            const threadExists = findById(forumStore.forumData.threads, to.params.id)
            // if exists continue, otherwise redirect to NotFound
            if (threadExists) {
                return next()
            } else {
                next({
                    name: 'NotFound',
                    params: {
                        pathMatch: to.path.substring(1).split('/')
                    },
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
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/thread/:id/edit',
        name: 'ThreadEdit',
        component: ThreadEdit,
        props: true,
        meta: {
            requiresAuth: true
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
        path: '/register',
        name: 'Register',
        component: RegistrationShow,
        meta: {
            requiresGuest: true
        },
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: SignInShow,
        meta: {
            requiresGuest: true
        },
    }, {
        path: '/logout',
        name: 'SignOut',
        beforeEnter() {
            const forumStore = useForumStore();
            forumStore.signOut();
            return {
                name: 'Home'
            }
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to) {
        const scroll = {}
        if (to.meta.toTop) scroll.top = 0
        if (to.meta.smoothScroll) scroll.behavior = 'smooth'
        return scroll
    }
})

router.beforeEach(async (to, from) => {
    const forumStore = useForumStore();
    await forumStore.initAuthentication()
    console.log(`🚦 Exiting ${from.name}, Entering ${to.name}!`)


    forumStore.unsubscribeAllSnapshots();

    if (to.meta.requiresAuth && !forumStore.authId) {
        return {
            name: 'SignIn', query: { redirectTo: to.path }
        }
    }

    if (to.meta.requiresGuest && forumStore.authId) {
        return {
            name: 'Home'
        }
    }
})

export default router