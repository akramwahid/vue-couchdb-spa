<template>
    <div>
        <div class="small-header transition animated fadeIn">
            <div class="hpanel">
                <div class="panel-body">
                    <div class="row float-e-margins">
                        <div class="col-md-2 hidden-xs">
                            <h2 class="font-light m-b-xs">
                                User List
                            </h2>
                            <small>Manage Librarian & Readers</small>
                        </div>

                        <div class="col-md-2">
                            <a class="btn btn-primary2 btn-block" data-toggle="modal" data-target="#create-user-modal">ADD NEW <i class="fa fa-user-plus"></i> </a>
                        </div>

                        <div class="col-md-2">
                            <a class="btn btn-primary2 btn-block" data-toggle="modal" data-target="#role-modal">MANAGE ROLES <i class="fa fa-users"></i> </a>
                        </div>

                        <div class="col-md-2 pull-right">
                            <button class="btn btn-md btn-defaultd text-success " type="button" @click="filterItems()"> FILTER <i class="fa fa-filter"></i></button>
                            <button class="btn btn-md btn-defaultd" type="button" @click="clearFilter()">CLEAR <i class="fa fa-undo"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div class="hpanel horange">
                    <div class="panel-heading hbuilt" style="padding: 5px 10px 0;background-color: #fcfdfe;">

                        <div class="row float-e-margins g" >

                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>UserID</label>
                                    <input type="text" class="form-control" v-model="searchByUserId" @input="isTypingUserId = true">
                                </div>
                            </div>

                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Name</label>
                                    <input type="text" class="form-control" v-model="searchByName" @input="isTypingName = true">
                                </div>
                            </div>


                            <div class="col-md-3">
                                <div class="form-group"><label>Email</label>
                                    <input type="text" class="form-control" v-model="searchByEmail" @input="isTypingEmail = true">
                                </div>
                            </div>

                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Roles</label>
                                    <select v-model="searchByRole" class="form-control" >
                                        <option value="">All</option>
                                        <option v-for="role in roles" :value="role">{{ role }}</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div class="panel-body" style="padding: 10px;">
                        <div class="table-responsived tableFixHead" >
                            <table cellpadding="1" cellspacing="1" class="table table-bordered table-striped table-hover">
                                <thead>
                                <tr>
                                    <th width="35">Action</th>
                                    <th width="20%">User ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th class="text-center">Active</th>
                                </tr>
                                </thead>

                                <tbody>
                                <tr v-for="(item, index) in items" :key="index">
                                    <td>
                                        <div class="float-e-margins ">
                                            <div class="btn-group ">
                                                <button data-toggle="dropdown" class="btn btn-default btn-md btn-circle dropdown-toggle"><i class="fa fa-ellipsis-v"></i> </button>
                                                <ul class="dropdown-menu pull-left">
                                                    <li><a href="javascript:void(0)" data-toggle="modal" data-target="#edit-user-modal" :data-user="item._id" class="btn btn-md edit-row text-left-important"><i class="fa fa-eye"></i> Edit </a></li>
                                                    <li><a @click="deleteUser(item)" class="btn btn-md delete-row text-left-important" ><i class="fa fa-trash-o"></i> <span class="bold">Delete</span></a></li>

                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{{ item.name }}</td>
                                    <td><span v-if="item.firstname && item.lastname">{{ item.firstname + ' ' + item.lastname }}</span></td>
                                    <td>{{ item.email }}</td>
                                    <td>{{ item.phone }}</td>
                                    <td class="text-center">
                                        <button v-if="item.active == 'yes'" class="btn btn-default btn-circle text-success" type="button" @click="deactivateUser(item)"><i class="fa fa-check"></i></button>
                                        <button v-if="item.active == 'no'" class="btn btn-default btn-circle btn-md ladda-button text-danger" type="button" @click="activateUser(item)"><i class="fa fa-exclamation"></i></button>
                                    </td>
                                </tr>


                                </tbody>

                                <tfoot>
                                <tr>
                                    <td colspan="7">
                                        <infinite-loading @infinite="infiniteHandler" :distance="distance" ref="infiniteLoading" spinner="default">
                                            <span slot="no-results" class="m-t-lg">
                                                <div class="alert alert-warning" >
                                                        No records found.
                                                </div>
                                            </span>

                                            <div slot="no-more" class="m-t-xs m-b-xs">
                                              <span class="text-info" >
                                                   There is no more records found :(
                                              </span>
                                            </div>
                                        </infinite-loading>

                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>




                    </div>

                </div>
            </div>
        </div>

        <edit-form :roles="roles" @userUpdated="filterItems"></edit-form>
        <create-form :roles="roles" @userCreated="filterItems"></create-form>
        <manage-role @roleUpdated="fetchRoleData"></manage-role>
    </div>
</template>

<script>
    import InfiniteLoading from 'vue-infinite-loading';
    import CreateForm from '@/components/user/CreateForm';
    import EditForm from '@/components/user/EditForm';
    import ManageRole from '@/components/user/ManageRole'
    import _ from 'lodash';


    export default {
        components: {
            CreateForm,
            EditForm,
            ManageRole,
            InfiniteLoading,
        },
        name: "ListView",
        data(){
            return{
                items:[],
                distance: 100,
                roles:[],
                searchByName: '',
                searchByUserId: '',
                searchByEmail: '',
                searchByRole: '',

                isTypingName: false,
                isTypingUserId: false,
                isTypingEmail: false
            }
        },

        watch:{
            //filter data table by user name
            searchByName: _.debounce(function () {
                this.isTypingName = false;
            }, 500),

            isTypingName: function (value) {
                if (!value) {
                    this.filterItems();
                }
            },

            //filter data table by user id
            searchByUserId: _.debounce(function () {
                this.isTypingUserId = false;
            }, 500),

            isTypingUserId: function (value) {
                if (!value) {
                    this.filterItems();
                }
            },

            //filter data table by user author
            searchByEmail: _.debounce(function () {
                this.isTypingEmail = false;
            }, 500),

            isTypingEmail: function (value) {
                if (!value) {
                    this.filterItems();
                }
            },

            //filter by user role
            searchByRole: function () {
                this.filterItems();
            },

        },

        methods: {
            infiniteHandler: function ($state) {
                var rows_per_page = process.env.PAGINATION_SIZE;
                var page = Math.ceil(this.items.length / rows_per_page); // == 1
                var skip = page * rows_per_page;

                let where = {
                    type: "user"
                };

                if (this.searchByUserId){
                    where.name = {
                        "$regex" : "(?i)"+this.searchByUserId
                    };
                }

                if (this.searchByName){
                    where.$or = [
                        {
                            firstname: {
                                "$regex" : "(?i)"+this.searchByName
                            }
                        },
                        {
                            lastname: {
                                "$regex" : "(?i)"+this.searchByName
                            }
                        }
                    ];
                }

                if (this.searchByEmail){
                    where.email =  {
                        "$eq" : this.searchByEmail
                    };
                }

                if (this.searchByRole){
                    where.roles = {
                        "$all" : [this.searchByRole]
                    };
                }

                axios({
                    method: 'POST',
                    url: process.env.COUCHDB_URL + '/_users/_find',
                    withCredentials: true,
                    data: {
                        limit: rows_per_page,
                        skip: skip,
                        selector: where
                    },
                }).then(response => {

                    if (response.data.docs.length) {
                        this.items = this.items.concat(response.data.docs);
                        //this.items = this.items.concat(_.map(response.data.rows, item => item.doc));
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                })
                    .catch(error => {
                        this.renderAjaxFailure(error.response.statusText);
                    })
            },

            deactivateUser(user){
                this.showWaitBlock()
                user.active = 'no';  //set the user status to inactive

                axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL +'/_users/' + user._id,
                    withCredentials: true,
                    data: user
                }).then(response => {
                    this.hideWaitBlock()
                    user._rev = response.data.rev;

                    this.showNotificationToast({ message: "User Account Blocked Successfully.", type: "success" })
                    this.filterItems();
                }).catch(error => {
                    this.hideWaitBlock()
                    this.renderAjaxFailure(error.response.statusText);
                })
            },

            activateUser(user){
                this.showWaitBlock()
                user.active = 'yes';  //set the user status to inactive

                axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL +'/_users/' + user._id,
                    withCredentials: true,
                    data: user
                }).then(response => {
                    this.hideWaitBlock()
                    user._rev = response.data.rev;

                    this.showNotificationToast({ message: "User Account UnBlocked Successfully.", type: "success" })
                    this.filterItems();
                }).catch(error => {
                    this.hideWaitBlock()
                    this.renderAjaxFailure(error.response.statusText);
                })
            },

            deleteUser: function (user) {
                const vm = this;
                swal({
                        title: "Are you sure?",
                        text: "Your will not be able to recover!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it!",
                        cancelButtonText: "No, cancel",
                        closeOnConfirm: true,
                        showLoaderOnConfirm: false
                    },
                    function () {
                        vm.showWaitBlock()

                        axios({
                            method: 'DELETE',
                            url: process.env.COUCHDB_URL +'/_users/' + user._id,
                            withCredentials: true,
                            params: { rev: user._rev }
                        }).then(response => {
                            vm.hideWaitBlock()
                            if (response.data.ok) {
                                vm.showNotificationToast({ message: "User Deleted Successfully.", type: "success" })
                                vm.filterItems();
                            }
                        }).catch(error => {
                            vm.hideWaitBlock()
                            vm.renderAjaxFailure(error.response.statusText);

                        })

                    });
            },

            filterItems: function () {
                this.items = [];
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            },
            clearFilter: function(){
                this.searchByUserId = '';
                this.searchByName = '';
                this.searchByEmail = '';
                this.searchByRole = '';

                this.filterItems();
            },

            fetchRoleData(){
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
            },

            syncRole(){
                var newRoles = {
                    "members": { "roles": [] }
                }
                this.roles.forEach(function(item,index){
                    newRoles.members.roles.push(item);
                });

                axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL + '/'+process.env.DB_NAME + '/_security',
                    withCredentials: true,
                    data: newRoles
                }).then(res => {

                }).catch(error => {
                    this.renderAjaxFailure(error.response.statusText);
                })
            }
        },
        mounted(){
            this.fetchRoleData();
        }
    }
</script>

<style scoped>

</style>