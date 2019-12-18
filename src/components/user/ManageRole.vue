<template>
    <div class="modal fade hmodal-success" id="role-modal" tabindex="-1" role="dialog" style="z-index: 100;">
        <div class="modal-dialog ">
            <div class="modal-content">
                <div class="modal-header py-10 px-20">
                    <div class="pull-right">
                        <button type="button" class="btn btn-danger2 pull-right" data-dismiss="modal"><i class="fa fa-times"></i> Close</button>
                    </div>
                    <h4 class="modal-title">Manage User Roles</h4>
                    <small class="font-bold">You can't delete default roles (reader,librarian) </small>

                </div>

                <div class="modal-body px-20" style="padding-bottom: 0px;">
                    <div>
                        <table class="table table-bordered " cellspacing="1" cellpadding="1">
                            <tbody>
                            <tr>
                                <td colspan="2" class="text-center text-primary font-bold">Create New Role</td>
                            </tr>
                            <tr>
                                <td width="70%">
                                    <div class="form-group"><label>Role Name</label>
                                       <input type="text" class="form-control" v-model="newRole"/>
                                    </div>

                                </td>
                                <td><button @click="createRole" type="button" class="btn btn-success btn-block m-t-md"><i class="fa fa-pencil-square-o"></i>  Save</button></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="table-responsive">

                        <table class="table table-bordered table-striped" cellspacing="1" cellpadding="1">
                            <thead>
                            <tr>
                                <th>Role Name</th>
                                <th width="10%">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-if="!roles.length">
                                <td colspan="2">
                                    <p class="text-center alert alert-warning">There is no any roles added yet!</p>
                                </td>
                            </tr>

                            <tr v-for="(role,index) in roles">
                                <td>{{ role }}</td>
                                <td><button @click="deleteRole(index)" class="btn btn-sm btn-danger2"><i class="fa fa-trash-o"></i></button></td>
                            </tr>

                            </tbody>
                        </table>
                    </div>



                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger2" data-dismiss="modal"><i class="fa fa-times"></i> Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "ManageRole",

        data(){
            return{
                newRole: '',
                roles: []
            }
        },
        computed: {

        },

        methods:{
            createRole(){
                if(this.newRole == ''){
                    this.renderAjaxFailure('Please enter role name');
                    return
                }
                this.roles.push(this.newRole);
                this.newRole = '';

                this.syncRole();
                this.showNotificationToast({ message: "New role added successfully.", type: "success" })
            },

            deleteRole(index){
                if(this.roles[index] == 'librarian' || this.roles[index] == 'reader'){
                    this.renderAjaxFailure("You can't delete the default roles !.");
                    return;
                }

                this.roles.splice(index,1);
                this.syncRole();
                this.showNotificationToast({ message: "A role deleted successfully.", type: "success" })
            },

            syncRole(){
                //whenever an item is added or removed, need to sync to database

                var newRoles = {
                    "members": { "roles": [] }
                }
                //'newRoles.members.roles.concat(this.roles)
                this.roles.forEach(function(item,index){
                    newRoles.members.roles.push(item);
                });

                axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL + '/'+process.env.DB_NAME + '/_security',
                    withCredentials: true,
                    data: newRoles
                }).then(res => {
                    this.$emit('roleUpdated');
                }).catch(error => {
                    this.renderAjaxFailure(error.response.statusText);
                })
            }

        },


        mounted() {
            $('#role-modal').on('show.bs.modal', event => {

                axios({
                    method: 'GET',
                    url: process.env.COUCHDB_URL + '/'+process.env.DB_NAME + '/_security',
                    withCredentials: true
                }).then(response => {

                    this.roles = [];
                    var currentRoles = response.data;

                    if(Object.keys(currentRoles).length && currentRoles.members && currentRoles.members.roles){
                        this.roles = this.roles.concat(currentRoles.members.roles);
                    }

                    //let's add the default permission if there is no any permission setup already
                    if (Object.keys(currentRoles).length === 0) {
                        this.roles.push('librarian','reader');
                        this.syncRole();

                    }else if(this.roles.indexOf('librarian') == -1 || this.roles.indexOf('reader') == -1){
                        if(this.roles.indexOf('librarian') == -1){
                            this.roles.push('librarian');
                        }

                        if(this.roles.indexOf('reader') == -1){
                            this.roles.push('reader');
                        }
                        this.syncRole();
                    }

                }).catch(error => {
                    this.renderAjaxFailure(error.response.statusText);
                })
            });
        }
    }
</script>

<style scoped>

</style>