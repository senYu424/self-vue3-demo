import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/pages/HomeView.vue'
import LetterView from '../views/pages/LetterView.vue'
import settingView from '../views/pages/settings.vue'
import copyView from '../views/pages/CopyTestView.vue'
import AiChatView from '../views/ai-pages/AiChatView.vue'
import DocPreviewView from '../views/pages/DocPreviewView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/letter',
    name: 'letter',
    component: LetterView
  },
  {
    path: '/settings',
    name: 'settings',
    component: settingView
  },
  {
    path: '/copy-test',
    name: 'copy-test',
    component: copyView
  },
  {
    path: '/ai-chat',
    name: 'ai-chat',
    component: AiChatView
  },
  {
    path: '/doc-preview',
    name: 'doc-preview',
    component: DocPreviewView
  },
  {
    path: '/:pathMatch(.*)*', // 捕获所有路由
    redirect: '/'// 重定向到首页
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 使用 HTML5 历史模式
  routes
})

router.beforeEach(async (to, from, next) => {
  return next();
})

export default router