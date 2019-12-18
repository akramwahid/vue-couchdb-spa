<template>
    <div class="register-container">
        <div class="row">
            <div class="col-md-12">
                <div class="text-center m-b-md">
                    <h3>Member Registration</h3>
                    <small>Online Member Registration is fast, easy, and free. </small>
                </div>
                <div class="hpanel">
                    <div class="panel-body">
                        <form @submit.prevent="onSubmitRegisterForm" id="loginForm">
                            <div class="row">
                                <div class="form-group col-lg-6">
                                    <label>First Name <small class="text-danger">(*)</small></label>
                                    <input type="text" v-model="firstname" class="form-control" >
                                </div>

                                <div class="form-group col-lg-6">
                                    <label>Last Name <small class="text-danger">(*)</small></label>
                                    <input type="text" v-model="lastname" class="form-control" >
                                </div>

                                <div class="form-group col-lg-12">
                                    <label>Username <small class="text-danger">(*)</small></label>
                                    <input type="text" v-model="username" class="form-control" >
                                </div>
                                <div class="form-group col-lg-6">
                                    <label>Password <small class="text-danger">(*)</small></label>
                                    <input type="password" v-model="password" class="form-control" >
                                </div>
                                <div class="form-group col-lg-6">
                                    <label>Repeat Password <small class="text-danger">(*)</small></label>
                                    <input type="password" v-model="password_confirm" class="form-control" >
                                </div>
                                <div class="form-group col-lg-6">
                                    <label>Email Address</label>
                                    <input type="text" v-model="email"  class="form-control" >
                                </div>
                                <div class="form-group col-lg-6">
                                    <label>Phone</label>
                                    <input type="text" v-model="phone" class="form-control" >
                                </div>

                            </div>
                            <div class="text-center m-t-md">
                                <button type="submit" class="btn btn-primary2">Register Now</button>
                                <router-link class="btn btn-default" :to="{name: 'login'}">Already have an account?</router-link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    export default {
        name: "RegisterPage",
        data(){
            return{
                autoIncrementId: 0,
                firstname: '',
                lastname: '',
                username: '',
                password: '',
                password_confirm: '',
                email: '',
                phone: ''
            }
        },
        computed: {
            userId: function () {
                return this.username+'-'+this.autoIncrementId
            }
        },
        methods: {
            async onSubmitRegisterForm(){
                if(this.username == '' || this.password == '' || this.firstname == '' || this.lastname == ''){
                    this.renderAjaxFailure('Please fill all the required fields');
                    return;
                }else if(this.password != this.password_confirm){
                    this.renderAjaxFailure("Password doesn't match!");
                    return;
                }

                //i must pass the admin credentials for basic auth, couchdb doesn't allow guest to create or update document
                await axios({
                    method: 'PUT',
                    auth: {
                        username: process.env.SERVER_ADMIN_USERNAME,
                        password: process.env.SERVER_ADMIN_PASSWORD
                    },
                    url: process.env.COUCHDB_URL +'/'+process.env.DB_NAME+'/_design/'+process.env.DB_DESIGN_DOCUMENT+'/_update/counter/user-count',
                    //withCredentials: true
                }).then(response => {
                    this.autoIncrementId = response.data;
                });


                const userObj = {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    username: this.userId,
                    password: this.password,
                    password_confirm: this.password_confirm,
                    email: this.email,
                    phone: this.phone,
                }

                this.showWaitBlock()

                axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL +'/_users/org.couchdb.user:' + userObj.username,
                    //withCredentials: true,
                    auth: {
                        username: process.env.SERVER_ADMIN_USERNAME,
                        password: process.env.SERVER_ADMIN_PASSWORD
                    },
                    data: {
                        "name": userObj.username,
                        "password": userObj.password,
                        "roles": ["reader"],
                        "type": "user",
                        "active": "yes",  //by default user are active
                        "firstname": userObj.firstname,
                        "lastname": userObj.lastname,
                        "email": userObj.email,
                        "phone": userObj.phone,

                    }
                }).then(response => {
                    this.hideWaitBlock()
                    swal('Success!', 'Your account was created successfully, and your User ID is '+this.userId, 'success');
                    this.$router.push({name: "login"})
                }).catch(error => {
                    this.hideWaitBlock()
                    this.renderAjaxFailure(error);
                })

            },


        }
    }
</script>
<style scoped>

</style>