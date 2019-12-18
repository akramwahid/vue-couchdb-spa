<template>
    <div class="modal fade hmodal-success" id="create-modal" tabindex="-1" role="dialog" style="z-index: 2147483647;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header py-10 px-20">
                    <div class="row">
                        <div class="col-md-11">
                            <h4>Add New Book</h4>
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
                                <div class="form-group">
                                    <label>BOOK ID</label>
                                    <input type="text" class="form-control" :value="bookId" readonly>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>BOOK ISBN <small class="text-danger">(*)</small></label>
                                    <input type="text" class="form-control" v-model="book.isbn">
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Category / Genre <small class="text-danger">(*)</small></label>
                                    <input type="text" class="form-control" v-model="book.category">
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Book Name <small class="text-danger">(*)</small></label>
                                    <input type="text" class="form-control" v-model="book.name">
                                </div>
                            </div>



                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Author <small class="text-danger">(*)</small></label>
                                    <input type="text" class="form-control" v-model="book.author">
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Published Date</label>
                                    <input type="text" class="form-control" v-model="book.publishedAt">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" @click="createBook"><i class="fa fa-save"></i> Save</button>
                    <button type="button" class="btn btn-warning2" data-dismiss="modal"><i class="fa fa-times"></i> Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CreateForm",
        data(){
            return{
                book: {
                    name: '',
                    category: '',
                    author: '',
                    publishedAt: '',
                    isbn: '',
                    type: 'book'
                }
            }
        },
        computed: {
            bookId: function () {
                return this.book.category+'-'+this.book.isbn
            }
        },
        methods: {
            createBook(){

                if(this.book.category == '' || this.book.isbn == '' || this.book.name == '' || this.book.author == ''){
                    this.renderAjaxFailure('Please fill all the required fields');
                    return;
                }
                this.book.type = 'book';
                this.showWaitBlock();
                axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL +'/'+process.env.DB_NAME+'/' + this.bookId,
                    withCredentials: true,
                    data: this.book
                }).then(response => {
                    this.hideWaitBlock();

                    this.$emit('bookCreated', Object.assign({
                        _id: this.bookId,
                        _rev: response.data.rev,
                    }, this.book));

                    this.clearBookForm();
                    $('#create-modal').modal('hide');
                    swal('Success!', 'Book Created Successfully', 'success');

                }).catch(error => {
                    this.hideWaitBlock();
                    this.renderAjaxFailure(error.response.statusText);
                })
            },

            clearBookForm() {
                this.book = {
                    name: '',
                    category: '',
                    author: '',
                    publishedAt: '',
                    isbn: ''
                }
            }
        }
    }
</script>

<style scoped>

</style>