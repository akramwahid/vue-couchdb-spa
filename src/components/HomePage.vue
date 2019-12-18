<template>
    <section  class="bg-light">
        <div class="container p-lg">
            <div class="row text-center">
                <div class="col-lg-12">
                    <h1>Welcome to Library Management System</h1>
                    <p>A Single Page Application (SPA) powered by CouchDB and Vue.JS </p>
                </div>
            </div>
            <div class="row text-center">
                <div class="col-md-3 col-md-offset-3">
                    <h4 class="m-t-lg">
                        <router-link :to="{name: 'login'}"><i class="fa fa-sign-in text-success icon-big fa-5x"></i></router-link>

                    </h4>
                    <strong>Login</strong>
                    <p>Admin , Librarian and Reader Login Form.</p>
                </div>
                <div class="col-md-3">
                    <h4 class="m-t-lg">
                        <router-link :to="{name: 'register'}"><i class="fa fa-user-plus text-success icon-big fa-5x"></i></router-link>

                    </h4>
                    <strong>Register</strong>
                    <p>Readers can register through this Form.</p>
                </div>

            </div>

        </div>
    </section>
</template>

<script>
    export default {
        name: 'HomePage',
        data () {
            return {

            }
        }
    }
</script>

<style scoped>

</style>
