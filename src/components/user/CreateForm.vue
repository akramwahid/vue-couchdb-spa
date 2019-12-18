<template>
    <div class="modal fade hmodal-success" id="create-user-modal" tabindex="-1" role="dialog" style="z-index: 2147483647;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header py-10 px-20">
                    <div class="row">
                        <div class="col-md-11">
                            <h4>Add New User</h4>
                        </div>
                        <div class="col-md-1">
                            <button type="button" class="btn btn-sm btn-danger2 pull-right" data-dismiss="modal"><i class="fa fa-times"></i></button>
                        </div>
                    </div>

                </div>
                <div class="modal-body px-20">
                    <form action="#">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="form-group col-lg-6">
                                        <label>First Name <small class="text-danger">(*)</small></label>
                                        <input type="text" v-model="user.firstname" class="form-control" >
                                    </div>

                                    <div class="form-group col-lg-6">
                                        <label>Last Name <small class="text-danger">(*)</small></label>
                                        <input type="text" v-model="user.lastname" class="form-control" >
                                    </div>

                                    <div class="form-group col-lg-12">
                                        <label>Username <small class="text-danger">(*)</small></label>
                                        <input type="text" v-model="user.username" class="form-control" >
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <label>Password <small class="text-danger">(*)</small></label>
                                        <input type="password" v-model="user.password" class="form-control" >
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <label>Repeat Password <small class="text-danger">(*)</small></label>
                                        <input type="password" v-model="user.password_confirm" class="form-control" >
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <label>Email Address</label>
                                        <input type="text" v-model="user.email"  class="form-control" >
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <label>Phone</label>
                                        <input type="text" v-model="user.phone" class="form-control" >
                                    </div>

                                    <div class="form-group col-md-6" >
                                        <input id="active" type="checkbox" v-model="user.active">
                                        <label for="active">
                                            User Active
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="hpanel horange">
                                    <div class="panel-heading hbuilt">
                                       Assign User Role
                                    </div>

                                    <div class="panel-body">
                                        <div class="row">
                                            <div class="col-md-6" v-for="role in roles">
                                                <div class="hpanel group" v-on:click="user.roles = role" style="cursor: pointer;">
                                                    <div class="panel-body file-body ">
                                                        <i class="fa fa-user-o text-primary"></i>
                                                    </div>
                                                    <div class="panel-footer text-center">
                                                        <input v-model="user.roles" :value="role" type="radio" :id="role"> <label :for="role"> {{ role }} </label>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" @click="createUser"><i class="fa fa-save"></i> Save</button>
                    <button type="button" class="btn btn-warning2" data-dismiss="modal"><i class="fa fa-times"></i> Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CreateForm",
        props: ['roles'],
        data(){
            return{
                user: {
                    autoIncrementId: '',
                    firstname: '',
                    lastname: '',
                    username: '',
                    password: '',
                    password_confirm: '',
                    email: '',
                    phone: '',
                    roles: '',
                    active: true
                }
            }
        },
        computed: {
            userId: function () {
                return this.user.username+'-'+this.user.autoIncrementId
            }
        },
        methods: {
            async createUser(){
                if(this.user.username == '' || this.user.password == '' || this.user.firstname == '' || this.user.lastname == ''){
                    this.renderAjaxFailure('Please fill all the required fields');
                    return;
                }else if(this.user.password != this.user.password_confirm){
                    this.renderAjaxFailure("Password doesn't match!");
                    return;
                }else if(!this.user.roles){
                    this.renderAjaxFailure('Please assign a role to the user');
                    return;
                }

                await axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL +'/'+process.env.DB_NAME+'/_design/'+process.env.DB_DESIGN_DOCUMENT+'/_update/counter/user-count',
                    withCredentials: true
                })
                .then(response => {
                    this.user.autoIncrementId = response.data;
                });

                this.showWaitBlock();

                axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL +'/_users/org.couchdb.user:' + this.userId,
                    withCredentials: true,
                    data: {
                        "name": this.userId,
                        "password": this.user.password,
                        "roles": [this.user.roles],
                        "type": "user",
                        "active": this.user.active ? "yes" : "no",
                        "firstname": this.user.firstname,
                        "lastname": this.user.lastname,
                        "email": this.user.email,
                        "phone": this.user.phone,
                    }
                }).then(response => {
                    this.hideWaitBlock();
                    this.$emit('userCreated');
                    this.clearUserForm();
                    $('#create-user-modal').modal('hide');
                    swal('Success!', 'User Created Successfully', 'success');

                }).catch(error => {
                    this.hideWaitBlock();
                    this.renderAjaxFailure(error.response.statusText);
                })
            },


            clearUserForm() {
                this.user = {
                    autoIncrementId: '',
                    firstname: '',
                    lastname: '',
                    username: '',
                    password: '',
                    password_confirm: '',
                    email: '',
                    phone: '',
                    roles: '',
                    active: false
                }
            }
        }
    }
</script>

<style scoped>

</style>