import Vue from 'vue'
import Resource from 'vue-resource'
import VueTables from 'vue-tables'
import CrudWrapper from './components/CrudWrapper.vue'

Vue.config.devtools = true;
Vue.use(VueTables.client, {
  compileTemplates: true,
  highlightMatches: true,
  filterByColumn: false,
  texts: {
    filter: "Search:"
  },
  datepickerOptions: {
    showDropdowns: true
  },
  perPage: 8,
  perPageValues: [8,10,25,50,100]
});
Vue.use(Resource);
new Vue({
  el: "#crudsection",
  data: {
    vue: Vue
  },
  components: {
    CrudTable: CrudWrapper
  },
  ready(){
    console.log("parent ready");
  }
});
