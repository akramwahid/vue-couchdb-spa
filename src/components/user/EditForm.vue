<template>
    <div class="modal fade hmodal-success" id="edit-user-modal" tabindex="-1" role="dialog" style="z-index: 2147483647;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header py-10 px-20">
                    <div class="row">
                        <div class="col-md-11">
                            <h4>Edit User</h4>
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

                                    <div class="form-group col-lg-12">
                                        <label>User ID <small class="text-danger">(*)</small></label>
                                        <input type="text" class="form-control" :value="user.name" readonly  >
                                    </div>

                                    <div class="form-group col-lg-6">
                                        <label>First Name <small class="text-danger">(*)</small></label>
                                        <input type="text" v-model="user.firstname" class="form-control" >
                                    </div>

                                    <div class="form-group col-lg-6">
                                        <label>Last Name <small class="text-danger">(*)</small></label>
                                        <input type="text" v-model="user.lastname" class="form-control" >
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
                    <button type="button" class="btn btn-success" @click="updateUser"><i class="fa fa-save"></i> Save</button>
                    <button type="button" class="btn btn-warning2" data-dismiss="modal"><i class="fa fa-times"></i> Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "EditForm",
        props: ['roles'],
        data(){
            return{
                user: {
                    _id: '',
                    _rev: '',
                    name: '',
                    firstname: '',
                    lastname: '',
                    password: '',
                    password_confirm: '',
                    email: '',
                    phone: '',
                    roles: '',
                    active: true
                }
            }
        },

        mounted() {
            $('#edit-user-modal').on('show.bs.modal', event => {
                let userId = $(event.relatedTarget).data('user');
                axios({
                    method: 'GET',
                    url: process.env.COUCHDB_URL + '/_users/'+userId,
                    withCredentials: true
                }).then(response => {
                    response.data.roles = response.data.roles[0]
                    this.user = response.data;
                    this.user.active = this.user.active == 'yes' ? true : false;
                    this.user.password = '';
                    this.user.password_confirm = '';
                })
                .catch(error => {
                    this.renderAjaxFailure(error.response.statusText);
                })
            });
        },

        methods: {
            updateUser(){
                if(this.user.firstname == '' || this.user.lastname == ''){
                    this.renderAjaxFailure('Please fill all the required fields');
                    return;
                }else if(this.user.password != '' && (this.user.password != this.user.password_confirm)){
                    this.renderAjaxFailure("Password doesn't match!");
                    return;
                }else if(!this.user.roles){
                    this.renderAjaxFailure('Please assign one or more roles to the user');
                    return;
                }

                this.showWaitBlock();

                this.user.active = this.user.active ? "yes" : "no";
                if(this.user.password == ''){
                    delete this.user.password;
                }
                delete this.user.password_confirm;
                this.user.roles = [this.user.roles];
                axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL +'/_users/' + this.user._id,
                    withCredentials: true,
                    data: this.user
                }).then(response => {
                    this.hideWaitBlock();
                    this.user._rev = response.data.rev;
                    this.$emit('userUpdated', this.user);
                    $('#edit-user-modal').modal('hide');
                    swal('Success!', 'User Updated Successfully', 'success');

                }).catch(error => {
                    this.hideWaitBlock();
                    this.renderAjaxFailure(error.response.statusText);
                })

            }
        }
    }
</script>

<style scoped>

</style>