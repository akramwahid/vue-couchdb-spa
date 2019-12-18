<template>
    <div class="modal fade hmodal-success" id="assign-modal" tabindex="-1" role="dialog" style="z-index: 100;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header py-10 px-20">
                    <div class="pull-right">
                        <button type="button" class="btn btn-danger2 pull-right" data-dismiss="modal"><i class="fa fa-times"></i> Close</button>
                    </div>
                    <h4 class="modal-title">Assign Book to Readers ({{ book._id }})</h4>
                    <small class="font-bold">Find the reader, select the checkout date and click assign </small>

                </div>

                <div class="modal-body px-20" style="padding-bottom: 0px;">
                    <div>
                        <table class="table table-bordered " cellspacing="1" cellpadding="1">
                            <tbody>
                            <tr>
                                <td colspan="2" class="text-center text-primary font-bold">Assign a Book Here</td>
                            </tr>
                            <tr>
                                <td width="50%">
                                    <div class="form-group"><label>Select a Reader (Search by name or UserId)</label>
                                        <multiselect v-model="reader" open-direction="bottom" :options="readers" placeholder="Select a Reader" label="fullnameSuffixWithUserId" track-by="name" ></multiselect>
                                    </div>

                                </td>
                                <td><button @click="checkoutBook" type="button" class="btn btn-success btn-block m-t-sm"><i class="fa fa-pencil-square-o"></i> <br> Checkout</button></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="table-responsive">
                        <h5>Current Checkout for this Book (To be returned)</h5>
                        <table class="table table-bordered table-striped" cellspacing="1" cellpadding="1">
                            <thead>
                                <tr>
                                    <th>Reader Name</th>
                                    <th>Book ID</th>
                                    <th>Book Name</th>
                                    <th>Taken Date</th>
                                    <th>Return Book</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!borrowedNotReturned.length">
                                    <td colspan="5">
                                        <p class="text-center alert alert-warning">There is no any current checkouts for this book!</p>
                                    </td>
                                </tr>

                                <tr v-for="item in borrowedNotReturned">
                                    <td>{{ item.user.firstname + ' '+ item.user.lastname + ' ('+item.userId+')' }}</td>
                                    <td>{{ item.bookId }}</td>
                                    <td>{{ item.book.name }}</td>
                                    <td>{{ item.takenAt.replace(/T/, ' ').replace(/\..+/, '') }}</td>
                                    <td><button @click="returnBook(item)" type="button" class="btn btn-warning2"><i class="fa fa-sign-in"></i> Return this book</button></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>


                    <div class="table-responsive">
                        <h5>Past Return History for this Book (Already returned)</h5>
                        <table class="table table-bordered table-striped" cellspacing="1" cellpadding="1">
                            <thead>
                            <tr>
                                <th>Reader Name</th>
                                <th>Book ID</th>
                                <th>Book Name</th>
                                <th>Taken Date</th>
                                <th>Return Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-if="!borrowedAndReturned.length">
                                <td colspan="5">
                                    <p class="text-center alert alert-warning">There is no any Past records for this book!</p>
                                </td>
                            </tr>
                            <tr v-for="item in borrowedAndReturned">
                                <td>{{ item.user.firstname + ' '+ item.user.lastname + ' ('+item.userId+')' }}</td>
                                <td>{{ item.bookId }}</td>
                                <td>{{ item.book.name }}</td>
                                <td>{{ item.takenAt.replace(/T/, ' ').replace(/\..+/, '') }}</td>
                                <td>{{ item.returnAt.replace(/T/, ' ').replace(/\..+/, '') }}</td>
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
    import Multiselect from 'vue-multiselect'
    export default {
        name: "AssignBook",
        components:{
            Multiselect
        },
        props: ['book'],
        data(){
            return{
                readers: [],
                reader: null,
                borrowing: [],

                borrow: {
                    _id: '',
                    userId: '',
                    bookId: '',
                    takenAt: '',
                    returnAt : ''
                },
            }
        },
        computed: {
            borrowedNotReturned: function () {
                return this.borrowing.filter((item) => {
                    return !item.returnAt
                })
            },
            borrowedAndReturned: function () {
                return this.borrowing.filter((item) => {
                    return item.returnAt != ''
                })
            }
        },

        methods:{
            fetchAllBorrowHistory(){
                this.borrowing = [];   //reset borrowing list on every request
                axios({
                    method: 'POST',
                    url: process.env.COUCHDB_URL + '/'+process.env.DB_NAME+'/_find',
                    withCredentials: true,
                    data: {
                        selector: {
                            type: "borrow",
                            bookId: this.book._id
                            //bookId: this.$route.params.book
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

            fetchAllReaders(){
                axios({
                    method: 'POST',
                    url: process.env.COUCHDB_URL + '/_users/_find',
                    // withCredentials: true,
                    auth: {
                        username: process.env.SERVER_ADMIN_USERNAME,
                        password: process.env.SERVER_ADMIN_PASSWORD
                    },
                    data: {
                        selector: {
                            type: "user",
                            roles : {
                                "$all" : ["reader"]
                            }
                        },

                    },
                }).then(response => {
                    if (response.data.docs.length) {
                        //loop through all the readers and add temporary property for select list
                        this.readers = response.data.docs.filter((item) => {
                            item.fullnameSuffixWithUserId = item.firstname+' '+item.lastname+ ' ('+item.name+')';
                            return item;
                        })
                    }
                }).catch(error => {
                    this.renderAjaxFailure(error.response.statusText);
                })
            },

            async checkoutBook(){
                if(!this.reader || _.isEmpty(this.reader)){
                    this.renderAjaxFailure('Please Select a Reader to assign / checkout a book');
                    return;
                }

                if(this.borrowing.findIndex(r => r.userId == this.reader.name && !r.returnAt ) > -1){
                    swal('Caution!', "The reader has already checked out the book, Please return it bellow and try to checkout again", 'error');
                    return;
                }

                await axios.get(process.env.COUCHDB_URL +'/_uuids')
                    .then(response => {
                        this.borrow._id = response.data.uuids[0];
                    });

                this.borrow.takenAt = new Date().toISOString();
                this.borrow.type = 'borrow';
                this.borrow.userId = this.reader.name;
                this.borrow.bookId = this.book._id;
                this.borrow.user = this.reader;
                this.borrow.book = this.book;

                this.showWaitBlock();

                axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL +'/'+process.env.DB_NAME+'/'+this.borrow._id,
                    withCredentials: true,
                    data: this.borrow
                }).then(response => {

                    this.hideWaitBlock();
                    this.showNotificationToast({ message: "You have successfully assigned the book to reader.", type: "success" })
                    this.borrow = {
                        _id: '',
                        userId: '',
                        bookId: '',
                        takenAt: '',
                        returnAt : ''
                    };
                    this.reader = {};
                    this.fetchAllBorrowHistory();

                }).catch(error => {
                    this.hideWaitBlock();
                    this.renderAjaxFailure(error.response.statusText);
                })
            },

            returnBook(bookToReturn){

                swal({
                    title: "Are you sure ?",
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
                    bookToReturn.returnAt = new Date().toISOString();

                    this.showWaitBlock();
                    axios({
                        method: 'PUT',
                        url: process.env.COUCHDB_URL +'/'+process.env.DB_NAME+'/'+bookToReturn._id,
                        withCredentials: true,
                        data: bookToReturn
                    }).then(response => {

                        this.hideWaitBlock();
                        this.showNotificationToast({ message: "You have successfully recorded the return of book.", type: "success" })
                        this.fetchAllBorrowHistory();

                    }).catch(error => {
                        this.hideWaitBlock();
                        this.renderAjaxFailure(error.response.statusText);
                    })

                }.bind(this))

            },

        },

        mounted() {
            this.fetchAllReaders();
            this.fetchAllBorrowHistory();
        }
    }
</script>

<style scoped>

</style>