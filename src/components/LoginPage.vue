<template>
    <div class="login-container">
        <div class="row">
            <div class="col-md-12">
                <div class="text-center m-b-md left-log col-md-4 bg-white">
                    <div class="profile-picturse">
                        <a>
                            <img src="@/assets/logo/200.png" style="width: 200px;height: auto;" class="img-circles m-b" >
                            <small>https://techalyst.com</small>
                        </a>
                        <div class="text-center m-b-md">
                            <small>Insert your credentials and you are ready to go!</small>
                        </div>
                    </div>
                </div>

                <div class="hpanel col-md-8 ">
                    <div class="panel-body right-login">
                        <form @submit.prevent="onSubmitLoginForm" id="loginForm">
                            <div class="form-group">
                                <label class="control-label" for="username">User ID</label>
                                <input type="text" v-model="userId" placeholder="Enter your User ID" required="" id="username" class="form-control">
                                <span class="help-block small">Your username to app</span>
                            </div>
                            <div class="form-group m-b-md">
                                <label class="control-label" for="password">Password</label>
                                <input type="password" v-model="password" title="Please enter your password" placeholder="******" required="" value="" name="password" id="password" class="form-control">
                                <span class="help-block small">Your password</span>
                            </div>

                            <button type="submit" class="btn btn-primary2 btn-block">Login</button>
                            <router-link class="btn btn-default btn-block" :to="{name: 'register'}">Don't have an account?</router-link>
                        </form>
                    </div>
                </div>
            </div>
        </div>


    </div>

</template>

<script>

    export default {
        name: "LoginPage",
        data(){
            return{
                userId: '',
                password: ''
            }
        },
        methods: {

            async onSubmitLoginForm(){
                const userCred = {
                    userId: this.userId,
                    password: this.password,
                }
                this.showWaitBlock()


                await axios({
                    method: 'POST',
                    url: process.env.COUCHDB_URL + '/_session',
                    withCredentials: true,
                    data: {
                        name: userCred.userId,
                        password: userCred.password
                    }
                }).then(response => {
                    //console.log(response);
                    this.hideWaitBlock()
                    if (response.status == 200) {
                        localStorage.setItem('userId', response.data.name)
                        localStorage.setItem('roles', JSON.stringify(response.data.roles))

                        this.$store.commit('storeUser', {
                            userId: response.data.name,
                            roles: response.data.roles,
                        })
                    }

                    if(this.$store.getters.isLoggedIn && !(response.data.roles.indexOf('_admin') > -1)){
                        axios({
                            method: 'GET',
                            url: process.env.COUCHDB_URL + '/_users/org.couchdb.user:'+this.$store.getters.getCurrentUserId,
                            withCredentials: true
                        }).then(res => {
                            this.$store.commit('storeUserObj', {
                                user: res.data,
                            })
                            localStorage.setItem('user', JSON.stringify(res.data))

                        })
                    }

                    this.showNotificationToast({ message: "Authentication Successful.", type: "success" })
                    this.$router.push({name: 'dashboard'})

                }).catch(error => {
                    this.hideWaitBlock()
                    this.renderAjaxFailure(error.response.statusText);
                });


            },


        }
    }
</script>

<style scoped>

</style>