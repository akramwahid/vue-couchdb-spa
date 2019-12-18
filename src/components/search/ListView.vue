<template>
    <div>
        <div class="small-header transition animated fadeIn">
            <div class="hpanel">
                <div class="panel-body">
                    <div class="row float-e-margins">
                        <div class="col-md-4 hidden-xs">
                            <h2 class="font-light m-b-xs">
                                Find your Book from Library
                            </h2>
                            <small>Search Library</small>
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
                                    <label>Search by Book ISBN</label>
                                    <input type="text" class="form-control" v-model="searchById" @input="isTypingId = true">
                                </div>
                            </div>

                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Search by Book Name</label>
                                    <input type="text" class="form-control" v-model="searchByName" @input="isTypingName = true">
                                </div>
                            </div>


                            <div class="col-md-3">
                                <div class="form-group"><label>Search by Genre</label>
                                    <input type="text" class="form-control" v-model="searchByGenre" @input="isTypingGenre = true">
                                </div>
                            </div>

                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Search by Author</label>
                                    <input type="text" class="form-control" v-model="searchByAuthor" @input="isTypingAuthor = true">
                                </div>
                            </div>

                        </div>

                    </div>

                    <div class="panel-body" style="padding: 10px;">
                        <div class="table-responsived tableFixHead" >
                            <table cellpadding="1" cellspacing="1" class="table table-bordered table-striped table-hover">
                                <thead>
                                <tr>
                                    <th width="20%">Book ISBN</th>
                                    <th>Book Name</th>
                                    <th>Genre</th>
                                    <th>Author Name</th>
                                    <!--<th class="text-center">Published At</th>-->
                                    <th class="text-center">Action</th>
                                </tr>
                                </thead>

                                <tbody>
                                <tr v-for="(item, index) in items" :key="index">
                                    <td>{{ item.isbn }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.category }}</td>
                                    <td>{{ item.author }}</td>
                                    <td class="text-center">
                                        <router-link class="btn btn-success" :to="{name: 'borrow', params: { book: item._id }}">Click here to View / Borrow Book</router-link>
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

    </div>
</template>

<script>
    import InfiniteLoading from 'vue-infinite-loading';
    import _ from 'lodash';


    export default {
        components: {
            InfiniteLoading,
        },
        name: "ListView",
        data(){
            return{
                items:[],
                distance: 100,
                searchById: '',
                searchByName: '',
                searchByAuthor: '',
                searchByGenre: '',
                isTypingId: false,
                isTypingName: false,
                isTypingAuthor: false,
                isTypingGenre: false
            }
        },

        watch:{
            //filter data table by book id
            searchById: _.debounce(function () {
                this.isTypingId = false;
            }, 500),

            isTypingId: function (value) {
                if (!value) {
                    this.filterItems();
                }
            },

            //filter data table by book name
            searchByName: _.debounce(function () {
                this.isTypingName = false;
            }, 500),

            isTypingName: function (value) {
                if (!value) {
                    this.filterItems();
                }
            },

            //filter data table by book author
            searchByAuthor: _.debounce(function () {
                this.isTypingAuthor = false;
            }, 500),

            isTypingAuthor: function (value) {
                if (!value) {
                    this.filterItems();
                }
            },

            //filter data table by book genre
            searchByGenre: _.debounce(function () {
                this.isTypingGenre = false;
            }, 500),

            isTypingGenre: function (value) {
                if (!value) {
                    this.filterItems();
                }
            },

        },

        methods: {
            infiniteHandler: function ($state) {
                var rows_per_page = process.env.PAGINATION_SIZE;
                var page = Math.ceil(this.items.length / rows_per_page); // == 1
                var skip = page * rows_per_page;

                let where = {
                    type: "book"
                };

                // if (this.searchById){
                //     where.isbn = this.searchById;
                // }

                if (this.searchById){
                    where.isbn = {
                        "$regex" : "(?i)"+this.searchById
                    };
                }

                if (this.searchByName){
                    where.name = {
                        "$regex" : "(?i)"+this.searchByName
                    };
                }

                if (this.searchByAuthor){
                    where.author =  {
                        "$regex" : "(?i)"+this.searchByAuthor
                    };
                }

                if (this.searchByGenre){
                    where.category = {
                        "$regex" : "(?i)"+this.searchByGenre
                    };
                }

                axios({
                    method: 'POST',
                    url: process.env.COUCHDB_URL + '/'+process.env.DB_NAME+'/_find',
                    withCredentials: true,
                    data: {
                        limit: rows_per_page,
                        skip: skip,
                        selector: where
                    },
                }).then(response => {


                    if (response.data.docs.length) {
                        this.items = this.items.concat(response.data.docs);
                        $state.loaded();
                    } else {
                        $state.complete();
                    }
                })
                .catch(error => {

                    this.renderAjaxFailure(error.response.statusText);
                })
            },

            filterItems: function () {
                this.items = [];
                this.$nextTick(() => {
                    this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
                });
            },
            clearFilter: function(){
                this.searchById = '';
                this.searchByName = '';
                this.searchByAuthor = '';
                this.searchByGenre = '';
                this.filterItems();
            },
        }
    }
</script>

<style scoped>

</style>