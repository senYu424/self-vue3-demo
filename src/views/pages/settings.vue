<template>
  <ren-dept-tree v-model="formInline.deptId" placeholder="全部支部"></ren-dept-tree>
</template>


<script setup>
// 在这里编写组合式 API 代码
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const formInline = ref({
  deptId: '2001478137386537018'
})


</script>

<style scoped></style>