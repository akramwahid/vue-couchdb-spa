<template>
    <div class="lock-container">
        <div>

            <div class="hpanel">
                <div class="panel-body text-center">

                    <i class="fa fa-lock big-icon text-danger" style="margin-top: 0"></i>
                    <p>Your Account has been blocked by the administrator. Please contact us for further information</p>
                    <br/>
                    <h4><span class="text-success">{{ today }}</span></h4>


                </div>
            </div>


        </div>
    </div>
</template>

<script>
    export default {
        name: "AccountBlocked",
        data(){
            return{
                today: new Date().toJSON().slice(0,10).replace(/-/g,'/')
            }
        }
    }
</script>

<style scoped>

</style>