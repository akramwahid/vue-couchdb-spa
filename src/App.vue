<template>

    <div id="app">
        <div id="header">
            <div class="color-line">
            </div>

            <nav role="navigation">

                <router-link class="header-link" :to="{name: 'dashboard'}" v-if="isLoggedIn"><i class="fa fa-home"></i></router-link>
                <router-link class="header-link" :to="{name: 'home'}" v-else><i class="fa fa-home"></i></router-link>


                <div class="small-logo">
                    <span class="text-primary">Library System</span>
                </div>

                <div class="mobile-menu" v-if="isLoggedIn">
                    <button type="button" class="navbar-toggle mobile-menu-toggle" data-toggle="collapse"
                            data-target="#mobile-collapse">
                        <i class="fa fa-chevron-down"></i>
                    </button>
                    <div class="collapse mobile-navbar" id="mobile-collapse">
                        <ul class="nav navbar-nav">
                            <li>
                                <a @click="logout">Logout</a>
                            </li>
                            <li>
                                <a>Profile</a>
                            </li>
                        </ul>
                    </div>
                </div>


                <div class="navbar-right" v-if="isLoggedIn">

                    <ul class="nav navbar-nav no-borders">
                        <li class="m-r-lg"><h4>Hello {{ this.$store.getters.getCurrentUserId }} !</h4></li>
                        <li class="dropdown">
                            <a @click="logout">
                                <i class="text-danger fa fa-power-off"></i>
                            </a>
                        </li>

                    </ul>
                </div>
            </nav>
        </div>


        <div id="wrapper">

            <div class="content">
                <router-view/>
            </div>

            <footer class="footer"><span class="pull-right">Developed by Akram Wahid</span> Copyright © 2019, All rights reserved.
            </footer>
        </div>
    </div>

</template>

<script>
    export default {
        name: 'App',
        data() {
            return {}
        },
        created: function () {
            const vm = this;
            axios.interceptors.response.use(undefined, function (err) {
                return new Promise(function (resolve, reject) {
                    if (err.response.status === 401 && err.response.config && !err.response.config.__isRetryRequest) {
                        vm.$store.dispatch('logout')
                        .then(() => {
                            vm.$router.push({name: "login"})
                        })
                    }
                    throw err;
                });
            });
        },
        computed: {
            isLoggedIn: function () {
                return this.$store.getters.isLoggedIn
            }
        },
        methods: {
            logout: function () {
                this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push({name: "login"})
                })
            }
        }
    }
</script>

<style src='./assets/vendor/fontawesome/css/font-awesome.css'></style>
<style src='./assets/vendor/metisMenu/dist/metisMenu.css'></style>
<style src='./assets/vendor/animate.css/animate.css'></style>
<style src='./assets/vendor/bootstrap/dist/css/bootstrap.css'></style>
<style src='./assets/vendor/toastr/build/toastr.min.css'></style>
<style src='./assets/styles/style.css'></style>
<style src='./assets/styles/static_custom.css'></style>
<style src='./assets/styles/custom.css'></style>
<style src='./assets/styles/menu/css/style.css'></style>
