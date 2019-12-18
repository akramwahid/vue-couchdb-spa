// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'


window._ = require('lodash');
window.axios = require('axios');
window.swal = require('sweetalert');
window.toastr = require('toastr');


Vue.config.productionTip = false;

Vue.mixin({
    methods: {
        async getFreshUUID(){
            axios.get(process.env.COUCHDB_URL +'/_uuids')
            .then(response => {
                return response.data.uuids[0];
            });

        },
        renderAjaxFailure: function (errors) {
            if (errors instanceof Array) {
                errorsHtml = '<ul>';

                errors.forEach(function (item, index) {
                    errorsHtml += '<li>' + item.message + '</li>';
                });
                errorsHtml += '</ul>';

                this.showNotificationToast({
                    message: errorsHtml,
                    type: "error"
                });

            } else {
                this.showNotificationToast({
                    message: errors,
                    type: "error"
                });
            }
        },

        showNotificationToast: function (n) {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": true,
                "progressBar": true,
                "positionClass": "toast-top-full-width",
                "timeOut": "1500",
                "extendedTimeOut": "1500",
                "toastClass": "animated fadeInDown",
            }

            if (n.type == "error" || n.type == "Fail") {
                toastr.error(n.message);
            } else if (n.type == 'success' || n.type == 'Success') {
                toastr.success(n.message);
            } else if (n.type == 'warning' || n.type == 'Warning') {
                toastr.warning(n.message);
            } else {
                toastr.info(n.message);
            }
        },

        showWaitBlock: function () {
            $.blockUI({
                css: {
                    border: "none",
                    padding: "5px",
                    "border-radius": "0px",
                    backgroundColor: "none",
                    width: "12%",
                    top: "40%",
                    left: "45%",
                    color: "#fff"
                },
                overlayCSS: {
                    backgroundColor: "none"
                },
                message: '<div class="spinner">\n' +
                '            <div class="rect1"></div>\n' +
                '            <div class="rect2"></div>\n' +
                '            <div class="rect3"></div>\n' +
                '            <div class="rect4"></div>\n' +
                '            <div class="rect5"></div>\n' +
                '        </div>',
                baseZ: 2147483648
            })
        },

        hideWaitBlock: function () {
            $.unblockUI()
        },
    }
});

new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
});