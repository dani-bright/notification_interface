<template>
  
  <div id="app">
      <h1 class="pageTitle">Notification interface</h1>
    <!-- <Tree/> -->
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/myDashBoard">myDashBoard</router-link>
    </nav>
    <router-view/>
  </div>
</template>
<script>

import Tree from './components/Tree.vue'


export default { 
  name: 'app',
  components: {
    Tree,
  },
  data() {
    return {
     
    };
  },
}
</script>

<style>
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"; 
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');

body {
  background-color: #EEEEEE;
  font-family: 'Montserrat', sans-serif;
  justify-items: center;
  padding: 20px;
  margin: 0;
}
.pageTitle{
  text-align: center;
  text-transform: uppercase;
  margin:0 0 20px;
}

nav {
  padding: 20px 20px 20px 0;
  position: absolute;
  top:60px;
  right: 5px;
}

nav a {
  padding: 10px;
  text-decoration: none;
  background: #43ACD9;
  border-radius: 3px;
  color:#fff;
  font-weight: bold;
  margin-right: 15px;
}
#app {
    width: 100%;
    margin: 0 auto;

}

</style>
