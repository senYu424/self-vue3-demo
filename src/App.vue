<template>
  <div id="app">
    <NavigationMenu />
    <router-view></router-view>
  </div>
</template>

<script>
import NavigationMenu from './components/NavigationMenu.vue';

export default {
  name: 'App',
  components: {
    NavigationMenu
  }
}
</script>

<style>
/* 保留原有的全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  line-height: 1.6;
  padding: 20px;
}

#app {
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
}
</style>