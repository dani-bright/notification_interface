import Vue from 'vue'
import Router from 'vue-router'
import myDashboard from './components/myDashboard.vue'
import Tree from './components/Tree.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Tree',
      component: Tree
    },
    {
      path: '/myDashboard/',//:name pour utiliser des parametre à réutiliser dans la page
      name: 'myDashboard',
      component: myDashboard
    }
  ]
})