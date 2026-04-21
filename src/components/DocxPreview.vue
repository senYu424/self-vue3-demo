<template>
  <div>
    <!-- 文档预览容器 -->
    <div ref="previewRef" style="min-height: 500px;"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  docxData: {
    type: Object,
    default: () => ({})
  }
});

const previewRef = ref(null); // 预览容器引用

// 使用docxtemplater填充模板数据
const fillTemplate = async (blob, data) => {
  try {
    // 动态导入所需库
    const JSZipUtils = (await import('jszip-utils')).default;
    const docxtemplater = (await import('docxtemplater')).default;
    const PizZip = (await import('pizzip')).default;

    return new Promise((resolve, reject) => {
      const fileUrl = URL.createObjectURL(blob);
      
      JSZipUtils.getBinaryContent(fileUrl, (error, content) => {
        URL.revokeObjectURL(fileUrl);
        
        if (error) {
          console.error('JSZipUtils 错误:', error);
          return reject(new Error(`文件读取失败: ${error.message}`));
        }

        try {
          // 检查内容是否为有效的ZIP文件
          if (!(content instanceof ArrayBuffer) && typeof content !== 'string') {
            return reject(new Error('文件内容格式不正确'));
          }

          const zip = new PizZip(content);
          const doc = new docxtemplater().loadZip(zip);

          doc.setOptions({
            nullGetter: () => ''
          });

          doc.setData(data);
          doc.render();

          const out = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          });

          resolve(out);
        } catch (err) {
          console.error('DOCX处理错误:', err);
          reject(new Error(`文档处理失败: ${err.message}`));
        }
      });
    });
  } catch (err) {
    throw new Error(`模板填充失败: ${err.message}`);
  }
};

// 检查响应是否为有效的DOCX文件
const isValidDocxResponse = async (response) => {
  // 检查状态码
  if (!response.ok) {
    return false;
  }
  
  // 检查Content-Type
  const contentType = response.headers.get('content-type');
  if (contentType && !contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') && 
      !contentType.includes('application/msword') && 
      !contentType.includes('application/octet-stream') &&
      !contentType.includes('application/zip')) {
    console.warn('可疑的Content-Type:', contentType);
  }
  
  return true;
};

// 渲染Word文档
const renderDocument = async () => {
  if (!previewRef.value) return;

  try {
    // 清空之前的预览内容
    previewRef.value.innerHTML = '加载中...';

    // 加载模板文件
    const response = await fetch('/template/letter.docx');
    if (!response.ok) {
      throw new Error(`模板文件不存在或无法访问 (${response.status})`);
    }

    // 获取文件Blob
    const templateBlob = await response.blob();

    // 填充模板数据
    const filledBlob = await fillTemplate(templateBlob, props.docxData);

    // 动态导入docx-preview
    const { renderAsync } = await import('docx-preview');

    // 渲染填充后的文档到容器
    await renderAsync(
      filledBlob,
      previewRef.value,
      null,
      {
        onProgress: (progress) => console.log('渲染进度：', progress),
        onError: (err) => console.error('渲染失败：', err),
      }
    );
  } catch (err) {
    console.error('预览失败：', err);
    previewRef.value.innerHTML = `
      <div style="color: #f56c6c; padding: 20px; background: #fef0f0; border: 1px solid #fde2e2; border-radius: 4px;">
        <h4>预览失败</h4>
        <p>${err.message}</p>
        <p>请检查控制台获取详细信息</p>
      </div>
    `;
  }
};

// 组件挂载后自动渲染
onMounted(() => {
  renderDocument();
});

// 监听数据变化，重新渲染
watch(() => props.docxData, () => {
  renderDocument();
}, { deep: true });
</script>

<style scoped>
/* 为预览容器添加一些基础样式 */
:deep(.docx) {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  max-width: 800px;
}
</style>