<template>
  <div class="doc-preview-container">
    <div class="header">
      <h1>DOCX文件在线预览</h1>
    </div>
    
    <div class="upload-section">
      <h2>上传DOCX文件</h2>
      <div class="upload-area" @drop="handleDrop" @dragover.prevent>
        <input 
          type="file" 
          ref="fileInput"
          accept=".docx"
          style="display: none"
          @change="handleFileChange"
        >
        <div class="upload-content" @click="triggerFileInput">
          <div class="upload-icon">📁</div>
          <div class="upload-text">点击或拖拽DOCX文件到此处</div>
          <div class="upload-hint">支持 .docx 格式文件</div>
        </div>
      </div>
      <div v-if="fileName" class="file-info">
        <span>已选择文件: {{ fileName }}</span>
        <button @click="clearFile">清除</button>
      </div>
    </div>
    
    <div v-if="fileContent" class="preview-section">
      <h2>文件预览</h2>
      <div class="preview-container" ref="previewContainer"></div>
    </div>
    
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading"></div>
        <p>正在加载文件...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { renderAsync } from 'docx-preview';

// 文件输入引用
const fileInput = ref(null);

// 预览容器引用
const previewContainer = ref(null);

// 文件信息
const fileName = ref('');
const fileContent = ref(null);
const isLoading = ref(false);

// 触发文件选择
function triggerFileInput() {
  fileInput.value.click();
}

// 处理文件选择
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
  }
}

// 处理拖放文件
function handleDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file && file.name.endsWith('.docx')) {
    processFile(file);
  }
}

// 处理文件
function processFile(file) {
  fileName.value = file.name;
  fileContent.value = file;
  isLoading.value = true;
  
  // 清空预览容器
  if (previewContainer.value) {
    previewContainer.value.innerHTML = '';
  }
  
  // 使用docx-preview库预览文件
  setTimeout(() => {
    renderAsync(file, previewContainer.value).then(() => {
      isLoading.value = false;
    }).catch(error => {
      console.error('预览失败:', error);
      isLoading.value = false;
    });
  }, 100);
}

// 清除文件
function clearFile() {
  fileName.value = '';
  fileContent.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  if (previewContainer.value) {
    previewContainer.value.innerHTML = '';
  }
}

// 组件挂载后初始化
onMounted(() => {
  // 可以在这里添加默认文件预览逻辑
});
</script>

<style scoped>
.doc-preview-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header {
  background-color: #4CAF50;
  color: white;
  padding: 15px;
  text-align: center;
  border-radius: 8px 8px 0 0;
  margin: -20px -20px 20px -20px;
}

.upload-section {
  margin-bottom: 30px;
}

.upload-section h2,
.preview-section h2 {
  color: #333;
  margin-bottom: 15px;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #4CAF50;
  background-color: #f9f9f9;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.upload-text {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.upload-hint {
  font-size: 14px;
  color: #666;
}

.file-info {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.file-info button {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.file-info button:hover {
  background-color: #d32f2f;
}

.preview-section {
  margin-top: 30px;
}

.preview-container {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 20px;
  min-height: 500px;
  max-height: 700px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
}

.loading {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0,0,0,.3);
  border-radius: 50%;
  border-top-color: #4CAF50;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .doc-preview-container {
    margin: 10px;
    padding: 15px;
  }
  
  .upload-area {
    padding: 30px;
  }
  
  .preview-container {
    min-height: 400px;
  }
}
</style>