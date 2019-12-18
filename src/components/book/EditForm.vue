<template>
    <div class="modal fade hmodal-success" id="edit-modal" tabindex="-1" role="dialog" style="z-index: 2147483647;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header py-10 px-20">
                    <div class="row">
                        <div class="col-md-11">
                            <h4>Edit Book</h4>
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
                                    <input type="text" class="form-control" :value="book._id" readonly>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Rev</label>
                                    <input type="text" class="form-control" :value="book._rev" readonly>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Book Name</label>
                                    <input type="text" class="form-control" v-model="book.name">
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Category / Genre</label>
                                    <input type="text" class="form-control"  :value="book.category" readonly>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Author</label>
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
                    <button type="button" class="btn btn-success" @click="updateBook"><i class="fa fa-save"></i> Save</button>
                    <button type="button" class="btn btn-warning2" data-dismiss="modal"><i class="fa fa-times"></i> Close</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "EditForm",
        data(){
            return{
                book: {
                    _id: '',
                    name: '',
                    category: '',
                    author: '',
                    publishedAt: '',
                    isbn: '',
                    type: 'book'
                }
            }
        },
        mounted() {
            $('#edit-modal').on('show.bs.modal', event => {
                let book = $(event.relatedTarget).data('book');
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
            });
        },
        methods:{
            updateBook() {
                this.showWaitBlock();
                this.book.type = 'book';
                axios({
                    method: 'PUT',
                    url: process.env.COUCHDB_URL +'/'+process.env.DB_NAME+'/' + this.book._id,
                    withCredentials: true,
                    data: this.book
                }).then(response => {
                    this.hideWaitBlock();

                    this.book._rev = response.data.rev;
                    this.$emit('bookUpdated', this.book);
                    $('#edit-modal').modal('hide');
                    swal('Success!', 'Book Updated Successfully', 'success');

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