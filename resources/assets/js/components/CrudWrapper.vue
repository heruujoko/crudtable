<template>
  <div class="" style="margin-bottom: 20px;">
    <crud-insert></crud-insert>
  </div>
  <br>
  <v-client-table :data="table_data" :columns="column_header" :options="options"></v-client-table>
  <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="crud_edit_modal" class="modal fade">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                  <h4 class="modal-title">Edit Data</h4>
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
                      <button @click="edit_submit_form" class="btn btn-primary">Submit</button>
              </form>
          </div>
      </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import CrudInsert from './CrudInsert.vue'
  import swal from 'sweetalert'
  export default {
    data(){
      return {
        lodash: _,
        swal: swal,
        vue: {},
        table_data: [],
        form_data:{},
        column_header: [],
        column_object: [],
        form_success: true,
        submitting: false,
        edit_id:0
      };
    },
    props: ['columns','endpoint'],
    components: {
      CrudInsert: CrudInsert
    },
    methods: {
      fetch_data: function(){
        this.$http.get(this.endpoint).then((response) => {
          this.table_data = response.data;
          this.add_actions();
        },(response) => {
          swal("Oops!", "failed to load data.", "error");
        });
      },
      fetch_edit:function(id){
        this.$http.get(this.endpoint+"/"+id).then((response) => {
          this.form_data = response.data;
        });
      },
      add_actions: function(){
        this.table_data.map(function(rowdata){
          rowdata.action = "<div class=\"dropdown\">"+
          "<button class=\"btn btn-primary btn-sm dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\">Action "+
          "<span class=\"caret\"></span></button>"+
              "<ul class=\"dropdown-menu\">"+
              "<li><a @click=\"this.$parent.edit_row("+rowdata.id+")\">Edit</a></li>"+
              "<li><a @click=\"this.$parent.delete_row("+rowdata.id+")\">Delete</a></li>"+
              "</ul>"+
              "</div>";
        });
      },
      edit_row: function(id){
        console.log('edit row '+id);
        this.fetch_edit(id);
        this.edit_id = id;
        $("#crud_edit_modal").modal('toggle');
      },
      delete_row: function(id){
        var vm = this;
        swal({
          title: "Are you sure?",
          text: "This action cannot be undone",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },function(){
          vm.$http.delete(vm.endpoint+"/"+id).then((response) => {
            if(response.status == 200){
              swal("Deleted!", "delete success.", "success");
              vm.fetch_data();
            } else {
              console.log(response);
              swal("Oops!", "problem has occured", "error");
            }
          });
        });
      },
      edit_submit_form: function(e){
        e.preventDefault();
        this.submitting = true;
        this.validate_form();
        if(this.form_success){
          this.$http.put(this.endpoint+"/"+this.edit_id,this.form_data).then((response) => {
            if(response.status == 200){
              $("#crud_edit_modal").modal('toggle');
              swal("Updated!", "update success.", "success");
              this.fetch_data();
            }
          },(response) => {
            $("#crud_edit_modal").modal('toggle');
            swal("Oops!", "problem occured.", "error");
            this.fetch_data();
          });
        }
      },
      validate_form: function(){
        var vm = this;
        this.form_success = true;
        this.column_object.map((input) => {
          if(vm.lodash.has(input,'required') && (input.required == true)){
            var required_id = vm.lodash.findIndex(vm.column_object,function(i){ return i.label == input.label});
            console.log(required_id);
            if(this.form_data[input.label]){
              this.column_object[required_id].warning = false;
              this.form_success = true;
            } else {
              this.column_object[required_id].warning = true;
              this.form_success = false;
            }
          }
        });
      }
    },
    ready(){
      var parsed = JSON.parse(this.columns);
      parsed.map((col) => {
        col.warning = false;
      });
      this.column_object = parsed;
      parsed.map((col) => {
        this.column_header.push(col.label);
      });
      this.column_header.push("action");
      this.fetch_data();
    },
    events:{
      'update_table': 'fetch_data'
    }
  }
</script>
