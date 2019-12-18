<template>
    <div class="category-main main-box" style="padding-top: 1%; padding-bottom: 1%;">
        <div class="main-box-sub">

            <section class="cd-section" v-if="isAdminRole">
                <router-link class="cd-bouncy-nav-trigger col1" :to="{name: 'users'}"><i class="fa fa-users fa-3x"></i> <h4>Manage Users</h4></router-link>
            </section>

            <section class="cd-section" v-if="isAdminRole || isLibrarianRole">
                <router-link class="cd-bouncy-nav-trigger col1" :to="{name: 'books'}"><i class="fa fa-book fa-3x"></i> <h4>Manage Books</h4></router-link>
            </section>

            <section class="cd-section" v-if="isReaderRole">
                <router-link class="cd-bouncy-nav-trigger col1" :to="{name: 'search'}"><i class="fa fa-search fa-3x"></i> <h4>Search Library</h4></router-link>
            </section>



            <section class="cd-section">
                <a class="cd-bouncy-nav-trigger col1" @click="logout"><i class="fa fa-power-off fa-3x"></i> <h4>Logout</h4></a>
            </section>
        </div>
    </div>

</template>

<script>
    export default {
        name: "Dashboard",
        methods: {
            logout: function () {
                this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push({name: "login"})
                })
            }
        },
        computed: {
            isAdminRole: function () {
                return this.$store.getters.getUserRoles.indexOf('_admin') > -1
            },

            isLibrarianRole: function () {
                return this.$store.getters.getUserRoles.indexOf('librarian') > -1
            },

            isReaderRole: function () {
                return this.$store.getters.getUserRoles.indexOf('reader') > -1
            },


        }
    }
</script>

<style scoped>

</style>