import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router/index';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userId: null,
        roles: [],
        user: null,
    },

    getters: {
        getUserRoles(state) {
            return state.roles
        },
        isLoggedIn(state) {
            return state.userId !== null
        },
        isAccountActive(state) {
            if (state.roles.indexOf('_admin') > -1 ){
                return true
            }else if(state.user && state.user.active == 'yes'){
                return true
            }else if(!state.user){
                return true
            }
            return false;
        },
        getCurrentUserId(state){
            return state.userId
        },
        getCurrentUser(state){
            return state.user
        }
    },

    mutations: {
        storeUser(state, userData) {
            state.userId = userData.userId;
            state.roles = userData.roles;

        },
        storeUserObj(state, userData) {
            state.user = userData.user;

        },
        logout(state) {
            state.userId = null;
            state.user = null;
            state.roles = [];
        }
    },

    actions: {
        logout({commit}) {
            return new Promise((resolve, reject) => {
                commit('logout')
                localStorage.removeItem('userId');
                localStorage.removeItem('roles');
                localStorage.removeItem('user');
                //delete axios.defaults.headers.common['Authorization']
                resolve()
            })

        }
    }


});