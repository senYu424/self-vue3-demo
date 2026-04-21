<template>
  <nav class="navigation-menu">
    <router-link to="/" class="nav-link">首页</router-link>
    <router-link to="/letter" class="nav-link">介绍信</router-link>
    <router-link to="/settings" class="nav-link">设置</router-link>
    <router-link to="/copy-test" class="nav-link">复制</router-link>
  </nav>
</template>

<script>
export default {
  name: 'NavigationMenu'
}
</script>

<style scoped>
.navigation-menu {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.nav-link {
  text-decoration: none;
  color: #4e6ef2;
  padding: 10px 20px;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: #4e6ef2;
  color: white;
  transform: translateY(-2px);
}

.nav-link.router-link-exact-active {
  background: #4e6ef2;
  color: white;
}
</style>