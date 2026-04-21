<!-- src/App.vue -->
<template>
  <div>

     <p type="danger" @click="handleExport">导出</p>
    <!-- 使用组件 -->
    <IntroductionLetter :formData="formData" />
     <!-- <DocxPreview :docx-data="formData" /> -->
    
    <!-- 表单区域 -->
    <div class="form-container">
      <h3>填写介绍信信息</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>姓名:</label>
          <input v-model="formData.name" placeholder="请输入姓名">
        </div>
        <div class="form-group">
          <label>性别:</label>
          <select v-model="formData.gender">
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div class="form-group">
          <label>年龄:</label>
          <input v-model="formData.age" type="number" placeholder="请输入年龄">
        </div>
        <div class="form-group">
          <label>民族:</label>
          <input v-model="formData.nationality" placeholder="请输入民族">
        </div>
        <div class="form-group">
          <label>党员状态:</label>
          <select v-model="formData.partyStatus">
            <option value="预备">预备党员</option>
            <option value="正式">正式党员</option>
          </select>
        </div>
        <div class="form-group">
          <label>身份证号码:</label>
          <input v-model="formData.idNumber" placeholder="请输入身份证号码">
        </div>
        <div class="form-group">
          <label>转出组织:</label>
          <input v-model="formData.fromOrganization" placeholder="请输入转出组织名称">
        </div>
        <div class="form-group">
          <label>转入组织:</label>
          <input v-model="formData.toOrganization" placeholder="请输入转入组织名称">
        </div>
        <div class="form-group">
          <label>党费交至:</label>
          <input v-model="formData.duesPaidUntil" placeholder="例如：2023年12月">
        </div>
        <div class="form-group">
          <label>有效期:</label>
          <input v-model="formData.validityDays" type="number" placeholder="请输入有效期天数">
        </div>
        <div class="form-group">
          <label>介绍信编号:</label>
          <input v-model="formData.letterNumber" placeholder="请输入介绍信编号">
        </div>
        <div class="form-group">
          <label>签发日期:</label>
          <input v-model="formData.issueDate" placeholder="请输入签发日期">
        </div>
      </div>
      
      <div class="action-buttons">
        <button @click="exportToPDF" class="export-btn">导出PDF文档</button>
        <button @click="fillDemoData" class="demo-btn">填充示例数据</button>
        <button @click="clearForm" class="clear-btn">清空表单</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { exportWord } from '../../utils/exportWord.js';
import IntroductionLetter from '../../components/IntroductionLetter.vue'
import DocxPreview from '../../components/DocxPreview.vue'

export default {
  name: 'App',
  components: {
    IntroductionLetter,
    DocxPreview
  },
  setup() {
    const formData = ref({
      name: '',
      gender: '男',
      age: '',
      nationality: '汉族',
      partyStatus: '正式',
      idNumber: '',
      fromOrganization: '',
      toOrganization: '',
      duesPaidUntil: '',
      validityDays: '30',
      letterNumber: '',
      issueDate: '',
      originalAddress: '',
      phone: '',
      fax: '',
      postalCode: '',
      receiptDate: '',
      processor: '',
      processorPhone: ''
    })

    const exportToPDF = async () => {
      try {
        // 生成介绍信的PDF
        const letterElement = document.querySelector('.introduction-letter')
        const canvas = await html2canvas(letterElement, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true
        })
        
        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 190
        const pageHeight = 277
        const imgHeight = canvas.height * imgWidth / canvas.width
        let heightLeft = imgHeight
        let position = 10
        
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        
        // 如果有剩余内容，添加新页
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }
        
        // 生成回执联的PDF
        const receiptElement = document.querySelector('.receipt')
        const receiptCanvas = await html2canvas(receiptElement, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true
        })
        
        pdf.addPage()
        const receiptImgData = receiptCanvas.toDataURL('image/png')
        const receiptImgHeight = receiptCanvas.height * imgWidth / receiptCanvas.width
        
        pdf.addImage(receiptImgData, 'PNG', 10, 10, imgWidth, receiptImgHeight)
        
        // 保存PDF
        pdf.save(`党员组织关系介绍信_${formData.value.name || '未命名'}.pdf`)
        
        alert('PDF导出成功！')
      } catch (error) {
        console.error('导出PDF失败:', error)
        alert('导出PDF失败，请稍后重试')
      }
    }

    const fillDemoData = () => {
      formData.value = {
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
      }
    }

    const clearForm = () => {
      Object.keys(formData.value).forEach(key => {
        formData.value[key] = ''
      })
      formData.value.gender = '男'
      formData.value.partyStatus = '正式'
      formData.value.nationality = '汉族'
      formData.value.validityDays = '30'
    }

    // 文档数据
const docxData = ref({
  meeting: '第三方都是',
  name: 'fsdfs',
  time: 'fdsfdsf',
  num1: 1,
  num2: 23,
  title1: 'sdfdf',
  content1: 'rfdsf',
  title2: 'sdfdf',
  content2: 'rfdsf',
  num: 4444,
});

const handleExport = () =>{
  exportWord(
    '/template/letter.docx',
    formData.value,
    '会议纪要',
  );
}

    return {
      formData,
      exportToPDF,
      fillDemoData,
      clearForm,
      handleExport,
      docxData
    }
  }
}
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #d90000;
  font-size: 28px;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-container h3 {
  color: #4e6ef2;
  margin-bottom: 20px;
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 2px solid #e9ecef;
  border-radius: 5px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4e6ef2;
  outline: none;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.export-btn,
.demo-btn,
.clear-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-btn {
  background: #d90000;
  color: white;
}

.export-btn:hover {
  background: #b30000;
  transform: translateY(-2px);
}

.demo-btn {
  background: #4e6ef2;
  color: white;
}

.demo-btn:hover {
  background: #3b5bdb;
  transform: translateY(-2px);
}

.clear-btn {
  background: #6c757d;
  color: white;
}

.clear-btn:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>