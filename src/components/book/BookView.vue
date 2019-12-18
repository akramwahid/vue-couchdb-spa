<template>
    <div class="row">
        <div class="col-lg-10 col-md-offset-1">
            <div class="hpanel ">
                <div class="panel-heading hbuilt" style="padding: 15px 15px 10px;background-color: #fcfdfe;">

                    <div class="row float-e-margins g" >
                        <div class="col-md-5 pull-left">
                            <button data-toggle="modal" data-target="#assign-modal" :data-book="book._id" type="button" class="btn btn-block btn-primary2"><i class="fa fa-pencil-square-o fa-2x"></i> Assign this Book / View Checkout Report</button>
                        </div>

                        <div class="col-md-3 pull-right">
                            <router-link class="btn btn-block btn-default" :to="{name: 'books'}"><i class="fa fa-arrow-right fa-2x"></i> Back to Book Manager</router-link>
                        </div>
                    </div>

                </div>

                <div class="panel-body" style="padding: 10px;">
                    <div class="row">
                        <div class="col-lg-10 col-md-offset-1">
                            <div class="hpanel">
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-md-7">
                                            <div class="media social-profile clearfix">
                                                <a class="pull-left">
                                                    <i class="fa fa-user-secret fa-4x"></i>
                                                </a>
                                                <div class="media-body">
                                                    <h5>Book Author : {{ book.author }}</h5>
                                                    <small class="text-muted">Published <i class="fa fa-calendar"></i> {{ book.publishedAt }}</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-5">
                                            <div class="pull-right">
                                                <star-rating :read-only="true" :item-size="25"  v-model="currentRating"></star-rating>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="social-content m-t-md">
                                        <h1>{{ book.name }}</h1>

                                        <h5 class="pull-left">Genre <i class="fa fa-arrow-right"></i> {{ book.category }}</h5>
                                        <h5 class="pull-right">ISBN <i class="fa fa-arrow-right"></i>  {{ book.isbn }}</h5>
                                    </div>
                                </div>
                                <div class="panel-footer">
                                    <div class="comment ">
                                        <h4 class="text-center m-b-lg">User Feedback</h4>

                                        <div v-if="comments.length > 0">
                                            <div class="social-talk" v-for="(comment,index) in comments" :key="index">
                                                <div class="media social-profile clearfix">
                                                    <a class="pull-left">
                                                        <i class="fa fa-user-o fa-2x m-t-xs"></i>
                                                    </a>

                                                    <div class="media-body">
                                                        <span class="font-bold">{{ comment.user.firstname+' '+ comment.user.lastname}}</span>
                                                        <small class="text-muted">{{ comment.createdAt }}</small>

                                                        <div class="social-content">
                                                            <p>{{ comment.message }}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="alert alert-warning" v-else>
                                            Be the first one to write a feedback
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
        <!--when book object is loaded by async task, render the component-->
        <assign-book v-if="isAlreadyFetchedBook" :book="book"></assign-book>
    </div>

</template>

<script>
    import {StarRating} from 'vue-rate-it';
    import AssignBook from '@/components/book/AssignBook';

    export default {
        name: "BookView",
        components:{
            StarRating,
            AssignBook
        },
        data(){
            return{
                book: {},
                currentRating: 0,
                comments: [],
            }
        },
        computed: {
            isAlreadyFetchedBook: function () {
                return !_.isEmpty(this.book)
            }
        },
        methods:{

            fetchBook(){
                let book = this.$route.params.book
                axios({
                    method: 'GET',
                    url: process.env.COUCHDB_URL + '/'+process.env.DB_NAME+'/'+book,
                    withCredentials: true
                }).then(response => {
                    this.book = response.data;
                }).catch(error => {
                        this.renderAjaxFailure(error.response.statusText);
                })
            },

            fatchAllCommentsByBook(){
                this.comments = [];   //reset comment list on every request
                axios({
                    method: 'POST',
                    url: process.env.COUCHDB_URL + '/'+process.env.DB_NAME+'/_find',
                    withCredentials: true,
                    data: {
                        selector: {
                            type: "comment",
                            bookId: this.$route.params.book
                        }
                    },
                }).then(response => {
                    if (response.data.docs.length) {
                        this.comments = response.data.docs;
                    }
                }).catch(error => {

                        this.renderAjaxFailure(error.response.statusText);
                })
            },


            fetchAverageRating(){

                axios({
                    method: 'GET',
                    url: process.env.COUCHDB_URL + '/'+process.env.DB_NAME+'/_design/'+process.env.DB_DESIGN_DOCUMENT+'/_view/avg_rating',
                    withCredentials: true,
                    params: {
                        key: '"'+this.$route.params.book+'"',
                        rereduce: true
                    },

                }).then(response => {
                    if (response.data.rows.length) {
                        this.currentRating = response.data.rows[0].value[0]
                    }
                }).catch(error => {
                    this.renderAjaxFailure(error.response.statusText);
                })
            },


        },

        mounted(){
            this.fetchBook();
            this.fatchAllCommentsByBook();
            this.fetchAverageRating();
        }
    }
</script>

<style scoped>

</style>