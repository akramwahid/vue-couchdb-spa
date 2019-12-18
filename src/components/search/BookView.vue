<template>
    <div class="row">
        <div class="col-lg-8 col-md-offset-2">
            <div class="hpanel ">
                <div class="panel-heading hbuilt" style="padding: 15px 15px 10px;background-color: #fcfdfe;">

                    <div class="row float-e-margins g" >
                        <div class="col-md-4 pull-left">
                            <button v-if="!isAlreadyCheckedOut" @click="checkoutBook" type="button" class="btn btn-block btn-info"><i class="fa fa-shopping-basket fa-2x"></i> Checkout this Book</button>
                            <button v-else @click="returnBook" type="button" class="btn btn-block btn-warning2"><i class="fa fa-sign-in fa-2x"></i> Return this Book</button>
                        </div>

                        <div class="col-md-4 pull-right">
                            <router-link class="btn btn-block btn-default" :to="{name: 'search'}"><i class="fa fa-search fa-2x"></i> Back to Library</router-link>
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
                                               <star-rating :read-only="isCurrentUserRated" :item-size="25" @rating-selected="saveRating" v-model="currentRating"></star-rating>
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

                                    <div class="social-form m-t-lg m-b-sm">
                                        <textarea v-model="comment.message" placeholder="Write your feedback" class="form-control m-b-sm"></textarea>
                                        <button type="button" @click="saveComment" class="btn btn-block btn-success"><i class="fa fa-paper-plane-o"></i> Post Your Feedback</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>

</template>

<script>
    import {StarRating} from 'vue-rate-it';

    export default {
        name: "BookView",
        components:{
            StarRating
        },
        data(){
            return{
                book: {},
                currentRating: 0,


                comments: [],

                comment: {
                    _id: '',
                    message: '',
                    userId: '',
                    bookId: '',
                    createdAt: ''
                },

                borrowing: [],

                borrow: {
                    _id: '',
                    userId: '',
                    bookId: '',
                    takenAt: '',
                    returnAt : ''
                },

                rating: {
                    _id: '',
                    userId: '',
                    bookId: '',
                    ratingSelected: '',
                    ratedAt: '',
                    type: 'rating'
                }

            }
        },
        computed: {
            currentUserName: function () {
                return this.$store.getters.getCurrentUserId
            },
            isAlreadyCheckedOut: function () {
                return this.borrowing.findIndex(r => r.userId == this.user.name && r.bookId == this.book._id && !r.returnAt ) > -1
            },
            isCurrentUserRated: function () {
                return this.rating._id != ''
            },
            user: function () {
                return this.$store.getters.getCurrentUser
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
                })
                .catch(error => {
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
                })
                .catch(error => {

                    this.renderAjaxFailure(error.response.statusText);
                })
            },

            async saveComment(){
                if(this.comment.message == ''){
                    this.renderAjaxFailure('Oops!,Please write something to post');
                    return;
                }

                await axios.get(process.env.COUCHDB_URL +'/_uuids')
                .then(response => {
                    this.comment._id = response.data.uuids[0];
                });

                this.comment.createdAt = new Date().toISOString();
                this.comment.type = 'comment';
                this.comment.userId = this.user.name;
                this.comment.bookId = this.book._id;
                this.comment.user = this.user;
                this.comment.book = this.book;

                this.showWaitBlock();

                axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL +'/'+process.env.DB_NAME+'/'+this.comment._id,
                    withCredentials: true,
                    data: this.comment
                }).then(response => {
                    this.hideWaitBlock();

                    this.showNotificationToast({ message: "Your feedback is valuable, Thank you!.", type: "success" })

                    this.comment = {
                        _id: '',
                        message: '',
                        userId: '',
                        bookId: '',
                        createdAt:''
                    }

                    this.fatchAllCommentsByBook();

                }).catch(error => {
                    this.hideWaitBlock();
                    this.renderAjaxFailure(error.response.statusText);
                })
            },

            async checkoutBook(){
                await axios.get(process.env.COUCHDB_URL +'/_uuids')
                    .then(response => {
                        this.borrow._id = response.data.uuids[0];
                    });
                swal({
                        title: "Are you sure you want to checkout?",
                        text: "You are above to checkout this book!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#74d348",
                        confirmButtonText: "Yes, checkout it!",
                        cancelButtonText: "No, cancel",
                        closeOnConfirm: true,
                        showLoaderOnConfirm: false
                },
                function () {

                    this.borrow.takenAt = new Date().toISOString();
                    this.borrow.type = 'borrow';
                    this.borrow.userId = this.user.name;
                    this.borrow.bookId = this.book._id;
                    this.borrow.user = this.user;
                    this.borrow.book = this.book;

                    this.showWaitBlock();

                    axios({
                        method: 'PUT',
                        url: process.env.COUCHDB_URL +'/'+process.env.DB_NAME+'/'+this.borrow._id,
                        withCredentials: true,
                        data: this.borrow
                    }).then(response => {

                        this.hideWaitBlock();
                        this.showNotificationToast({ message: "You have successfully checkout the book.", type: "success" })
                        this.borrow = {
                            _id: '',
                            userId: '',
                            bookId: '',
                            takenAt: '',
                            returnAt : ''
                        }
                        this.fetchUserBorrowHistory();

                    }).catch(error => {
                        this.hideWaitBlock();
                        this.renderAjaxFailure(error.response.statusText);
                    })

                }.bind(this))

            },

            fetchUserBorrowHistory(){
                this.borrowing = [];   //reset borrowing list on every request
                axios({
                    method: 'POST',
                    url: process.env.COUCHDB_URL + '/'+process.env.DB_NAME+'/_find',
                    withCredentials: true,
                    data: {
                        selector: {
                            type: "borrow",
                            bookId: this.$route.params.book,
                            userId: this.currentUserName
                        }
                    },
                }).then(response => {
                    if (response.data.docs.length) {
                        this.borrowing = response.data.docs;
                    }
                }).catch(error => {

                    this.renderAjaxFailure(error.response.statusText);
                })
            },

            returnBook(){
               //find the record for checkout from the borrowing records array
                swal({
                    title: "Are you sure you want to return?",
                    text: "You are above to mark the book as returned!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#74d348",
                    confirmButtonText: "Yes, return it!",
                    cancelButtonText: "No, cancel",
                    closeOnConfirm: true,
                    showLoaderOnConfirm: false
                },
                function () {
                    let bookToReturn = this.borrowing.filter((item) => {
                        return item.userId == this.user.name && item.bookId == this.book._id && !item.returnAt;
                    })[0];

                    bookToReturn.returnAt = new Date().toISOString();

                    this.showWaitBlock();
                    axios({
                        method: 'PUT',
                        url: process.env.COUCHDB_URL +'/'+process.env.DB_NAME+'/'+bookToReturn._id,
                        withCredentials: true,
                        data: bookToReturn
                    }).then(response => {

                        this.hideWaitBlock();
                        this.showNotificationToast({ message: "You have successfully returned the book.", type: "success" })
                        this.fetchUserBorrowHistory();

                    }).catch(error => {
                        this.hideWaitBlock();
                        this.renderAjaxFailure(error.response.statusText);
                    })

                }.bind(this))

            },

            async saveRating(){
                await axios.get(process.env.COUCHDB_URL +'/_uuids')
                    .then(response => {
                        this.rating._id = response.data.uuids[0];
                    });

                this.rating.ratingSelected = this.currentRating;
                this.rating.ratedAt = new Date().toISOString();
                this.rating.userId = this.user.name;
                this.rating.bookId = this.book._id;
                this.rating.user = this.user;
                this.rating.book = this.book;

                this.showWaitBlock();

                axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL +'/'+process.env.DB_NAME+'/'+this.rating._id,
                    withCredentials: true,
                    data: this.rating
                }).then(response => {

                    this.hideWaitBlock();
                    this.showNotificationToast({ message: "Your rating is valuable, Thank you!.", type: "success" })

                    this.fetchAverageRating();  //i need to call this function here, because there may be any other rating already by other users

                }).catch(error => {
                    this.hideWaitBlock();
                    this.renderAjaxFailure(error.response.statusText);
                })

            },

            fetchCurrentUserRating(){
                axios({
                    method: 'POST',
                    url: process.env.COUCHDB_URL + '/'+process.env.DB_NAME+'/_find',
                    withCredentials: true,
                    data: {
                        selector: {
                            type: "rating",
                            bookId: this.$route.params.book,
                            userId: this.currentUserName
                        }
                    },
                }).then(response => {
                    if (response.data.docs.length) {
                        this.rating = response.data.docs[0];
                    }
                }).catch(error => {
                    this.renderAjaxFailure(error.response.statusText);
                })
            },

            fetchAverageRating(){
                //this.currentRating = 0;
                axios({
                    method: 'GET',
                    url: process.env.COUCHDB_URL + '/'+process.env.DB_NAME+'/_design/'+process.env.DB_DESIGN_DOCUMENT+'/_view/avg_rating',
                    withCredentials: true,
                    params: {
                        key: '"'+this.$route.params.book+'"',
                        rereduce: true
                    },

                }).then(response => {
                    //console.log(response.data.rows[0].value[0]);
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
            this.fetchUserBorrowHistory();
            this.fetchCurrentUserRating();
            this.fetchAverageRating();
        }
    }
</script>

<style scoped>

</style>