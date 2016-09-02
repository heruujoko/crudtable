<template>
  <button class="btn btn-primary" href="#crud_insert_modal" data-toggle="modal">Add New +</button>
  <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="crud_insert_modal" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
        <h4 class="modal-title">Add New</h4>
      </div>
      <div class="modal-body">

        <form>
          <div class="form-group" v-for="col in column_object">
            <label class="control-label">{{ col.label | capitalize }}</label>
            <input class="form-control" type="text" v-if="col.type == 'text'" v-model="form_data[col.label]">
            <input class="form-control" type="password" v-if="col.type == 'password'" v-model="form_data[col.label]">
            <input class="form-control" type="email" v-if="col.type == 'email'" v-model="form_data[col.label]">
            <textarea class="form-control" v-if="col.type == 'textarea'" v-model="form_data[col.label]"></textarea>
            <label class="warning-label" style="color:#F27474;" v-if="col.warning && (!form_data[col.label] && submitting )">This field is required.<label>
          </div>
          <button @click="submit_form" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        submitting: false,
        form_success: true,
        column_object: [],
        form_data:{},
        _ : {},
        endpoint: ""
      };
    },
    methods: {
      validate_form: function(){
        this.form_success = true;
        this.column_object.map((input) => {
          if(this._.has(input,'required') && (input.required == true)){
            var required_id = this._.findIndex(this.column_object,function(i){ return i.label == input.label});
            if(this.form_data[input.label]){
              this.column_object[required_id].warning = false;
              this.form_success = true;
            } else {
              this.column_object[required_id].warning = true;
              this.form_success = false;
            }
          }
        });
      },
      submit_form: function(e){
        e.preventDefault();
        this.submitting = true;
        this.validate_form();
        if(this.form_success){
          this.$http.post(this.endpoint,this.form_data).then((response) => {
            $("#crud_insert_modal").modal('toggle');
            this.$dispatch('update_table');
            swal("Success!", "action performed.", "success");
            this.form_data = {};
          },(response)=>{
            swal("Oops!", "action failed.", "error");
            this.form_data = {};
          });
        }
      }
    },
    watch: {
      'column_object': {
        handler: function(){
          this.validate_form();
        },
        deep: true
      }
    },
    ready(){
      this._ = this.$parent.lodash;
      this.endpoint = this.$parent.endpoint;
      this.swal = this.$parent.swal;
      var parsed_column = JSON.parse(this.$parent.columns);
      parsed_column.map((col) => {
        col.warning = false;
      });
      this.column_object = parsed_column;
    }
  }
</script>
