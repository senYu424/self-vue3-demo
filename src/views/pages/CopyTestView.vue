<template>
  <div class="copy-test-container">
    <h2>一键复制功能测试</h2>
    
    <div class="test-section">
      <h3>基础文本复制</h3>
      <div class="input-group">
        <label>输入要复制的文本:</label>
        <input 
          v-model="copyText" 
          type="text" 
          placeholder="输入要复制的文本"
        />
        <CopyButton :text="copyText" />
      </div>
    </div>
    
    <div class="test-section">
      <h3>富文本内容复制</h3>
      <div class="content-display">
        <p>姓名：{{ formData.name }}</p>
        <p>组织关系：由 {{ formData.fromOrganization }} 转去 {{ formData.toOrganization }}</p>
        <p>有效期：{{ formData.validityDays }} 天</p>
      </div>
      <CopyButton 
        :text="formattedContent" 
        default-text="复制介绍信内容" 
        success-text="已复制内容"
      />
    </div>
    
    <div class="test-section">
      <h3>JSON数据复制</h3>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      <CopyButton 
        :text="JSON.stringify(formData, null, 2)" 
        default-text="复制JSON数据" 
        success-text="已复制JSON"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import CopyButton from '../../components/CopyButton.vue';

export default {
  name: 'CopyTestView',
  components: {
    CopyButton
  },
  setup() {
    const copyText = ref('这是一段可以复制的文本');
    
    const formData = ref({
      name: '张三',
      gender: '男',
      age: '35',
      nationality: '汉族',
      partyStatus: '正式',
      idNumber: '110101199001011234',
      fromOrganization: 'XX市XX区XX街道党委',
      toOrganization: 'XX市XX区XX单位党委',
      duesPaidUntil: '2023年12月',
      validityDays: '30',
      letterNumber: '2023001',
      issueDate: '2023年10月15日',
      originalAddress: 'XX市XX区XX街道XX号',
      phone: '010-12345678',
      fax: '010-87654321',
      postalCode: '100000',
      receiptDate: '2023年10月20日',
      processor: '李四',
      processorPhone: '13800138000'
    });
    
    const formattedContent = computed(() => {
      return `中国共产党党员组织关系介绍信
姓名：${formData.value.name}
组织关系：由 ${formData.value.fromOrganization} 转去 ${formData.value.toOrganization}
有效期：${formData.value.validityDays} 天
签发日期：${formData.value.issueDate}`;
    });
    
    return {
      copyText,
      formData,
      formattedContent
    };
  }
};
</script>

<style scoped>
.copy-test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.test-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.test-section h3 {
  color: #4e6ef2;
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-group label {
  font-weight: bold;
  color: #333;
}

.input-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.content-display {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.content-display p {
  margin: 8px 0;
}

pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 200px;
  overflow-y: auto;
}
</style>