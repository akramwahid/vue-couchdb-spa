import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/components/HomePage'
import LoginPage from '@/components/LoginPage'
import AccountBlocked from '@/components/AccountBlocked'
import AccessDenied from '@/components/AccessDenied'
import RegisterPage from '@/components/RegisterPage'
import Dashboard from '@/components/Dashboard'
import DatatableBook from '@/components/book/ListView'
import AssignBook from '@/components/book/BookView'
import DatatableUser from '@/components/user/ListView'
import BookFinder from '@/components/search/ListView'
import BookView from '@/components/search/BookView'

import store from '../store'

Vue.use(VueRouter);
// export default new Router({
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
            meta: {
                requireGuest: true
            }
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterPage,
            meta: {
                requireGuest: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
            meta: {
                requireGuest: true
            }
        },
        {
            path: '/blocked',
            name: 'blocked',
            component: AccountBlocked,
        },
        {
            path: '/denied',
            name: 'denied',
            component: AccessDenied,

        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: {
                requiresAuth: true,
                acl: ['_admin','librarian','reader']
            }
        },
        {
            path: '/books',
            name: 'books',
            component: DatatableBook,
            meta: {
                requiresAuth: true,
                acl: ['_admin','librarian']
            }
        },
        {
            path: '/assign/book/:book',
            name: 'assign',
            component: AssignBook,
            meta: {
                requiresAuth: true,
                acl: ['_admin','librarian']
            }
        },
        {
            path: '/users',
            name: 'users',
            component: DatatableUser,
            meta: {
                requiresAuth: true,
                acl: ['_admin']
            }
        },
        {
            path: '/search/books',
            name: 'search',
            component: BookFinder,
            meta: {
                requiresAuth: true,
                acl: ['reader']
            }
        },
        {
            path: '/borrow/book/:book',
            name: 'borrow',
            component: BookView,
            meta: {
                requiresAuth: true,
                acl: ['reader']
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    //let populate store state from local storage for use login details
    if(localStorage.getItem('userId') && localStorage.getItem('roles')){
        var rolesArr = JSON.parse(localStorage.getItem('roles'))
        store.commit('storeUser', {
            userId: localStorage.getItem('userId'),
            roles: rolesArr,
        });
    }

    if(localStorage.getItem('user')){
        var userObj = JSON.parse(localStorage.getItem('user'))
        store.commit('storeUserObj', {
            user: userObj
        })
    }

    if(to.meta.requiresAuth) {
        if (store.getters.isLoggedIn) {
            if(store.getters.isAccountActive){
                //console.log(to.meta.acl)
                if(_.intersection(to.meta.acl,store.getters.getUserRoles).length > 0){
                    next();
                }else{
                    next({name: 'denied'});
                }

            }else{
                next({name: 'blocked'});
            }
        }else{
            next({name: 'login'});
        }

    } else if(to.meta.requireGuest){
        if (store.getters.isLoggedIn) {
            if(store.getters.isAccountActive){
                next({name: 'dashboard'});
            }else{
                next({name: 'blocked'});
            }
        }else{
            next();
        }

    }
    next();

});

export default router;