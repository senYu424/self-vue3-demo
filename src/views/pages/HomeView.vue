<template>
  <div class="home">
    <div class="header">
      <h1>党员组织关系介绍信系统</h1>
      <p>欢迎使用党员组织关系介绍信系统</p>
    </div>

    <div class="menu-container">
      <div class="menu-header">
        <h2>系统菜单</h2>
      </div>
      
      <div class="menu-grid">
        <div 
          v-for="(item, index) in menuItems" 
          :key="index" 
          class="menu-item"
          @click="navigateTo(item.path)"
        >
          <div class="menu-icon">{{ item.icon }}</div>
          <div class="menu-title">{{ item.title }}</div>
          <div class="menu-description">{{ item.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      menuItems: [
        {
          title: '介绍信管理',
          path: '/letter',
          icon: '📄',
          description: '创建和管理党员组织关系介绍信'
        },
        {
          title: '系统设置',
          path: '/settings',
          icon: '⚙️',
          description: '配置系统参数和选项'
        },
        {
          title: 'AI助手',
          path: '/ai-chat',
          icon: '🤖',
          description: '与大模型AI进行交互对话'
        },
        {
          title: '文档预览',
          path: '/doc-preview',
          icon: '👁️',
          description: '在线预览DOCX文件内容'
        }
      ]
    }
  },
  methods: {
    navigateTo(path) {
      if (path.startsWith('http')) {
        window.open(path, '_blank')
      } else {
        this.$router.push(path)
      }
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 0;
  background: linear-gradient(135deg, #4e6ef2, #4a69e2);
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.menu-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.menu-header {
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.menu-header h2 {
  color: #333;
  margin: 0;
  font-size: 1.5rem;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.menu-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-color: #4e6ef2;
}

.menu-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.menu-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.menu-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .menu-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    padding: 15px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .header {
    padding: 20px 0;
  }
}
</style>