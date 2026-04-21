<!-- src/components/IntroductionLetter.vue -->
<template>
  <div class="preview-container">
    <!-- 添加复制按钮 -->
    <div class="copy-section">
      <CopyButton :text="formattedLetterContent" default-text="复制介绍信内容" size="18" />
    </div>
    
    <!-- 介绍信预览 -->
    <div class="introduction-letter">
      <div class="letter-header">
        <h2>中国共产党党员组织关系介绍信</h2>
        <div class="letter-number">第 {{ formData.letterNumber }} 号</div>
      </div>
      
      <div class="letter-content">
        <p>
          {{ formData.name }}同志({{ formData.gender }}), {{ formData.age }}岁，{{ formData.nationality }}，
          系中共{{ formData.partyStatus }}党员，身份证号码 {{ formData.idNumber }}，
          由 {{ formData.fromOrganization }} 转去 {{ formData.toOrganization }}。
        </p>
        <p>
          请转接组织关系。该同志党费已交到 {{ formData.duesPaidUntil }}。
        </p>
        <p>（有效期 {{ formData.validityDays }} 天）</p>
      </div>
      
      <div class="letter-footer">
        <div class="signature">
          （盖章）
        </div>
        <div class="date">
          {{ formData.issueDate }}
        </div>
      </div>
      
      <div class="contact-info">
        <p>党员原所在基层党委通讯地址：{{ formData.originalAddress }}</p>
        <p>联系电话：{{ formData.phone }} 传真：{{ formData.fax }} 邮编：{{ formData.postalCode }}</p>
      </div>
    </div>
    
    <!-- 回执联预览 -->
    <div class="receipt">
      <div class="receipt-header">
        <h3>中国共产党党员组织关系介绍信回执联</h3>
        <div class="receipt-number">第 {{ formData.letterNumber }} 号</div>
        <div class="receipt-part">第三联</div>
      </div>
      
      <div class="receipt-content">
        <p>
          {{ formData.name }}同志的党员组织关系已转达我处，特此回复。
        </p>
      </div>
      
      <div class="receipt-footer">
        <div class="signature">
          （盖章）
        </div>
        <div class="date">
          {{ formData.receiptDate }}
        </div>
      </div>
      
      <div class="processor-info">
        <p>经办人：{{ formData.processor }} 联系电话：{{ formData.processorPhone }}</p>
      </div>
      
      <div class="receipt-note">
        注：回执联由接收党员组织关系的基层党委在接收党员后一个月内邮寄或传真至党员原所在基层党委
      </div>
    </div>
  </div>
</template>

<script>
import CopyButton from './CopyButton.vue';

export default {
  name: 'IntroductionLetter',
  components: {
    CopyButton
  },
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedLetterContent() {
      return `中国共产党党员组织关系介绍信 第 ${this.formData.letterNumber} 号

${this.formData.name}同志(${this.formData.gender}), ${this.formData.age}岁，${this.formData.nationality}，
系中共${this.formData.partyStatus}党员，身份证号码 ${this.formData.idNumber}，
由 ${this.formData.fromOrganization} 转去 ${this.formData.toOrganization}。

请转接组织关系。该同志党费已交到 ${this.formData.duesPaidUntil}。
（有效期 ${this.formData.validityDays} 天）

党员原所在基层党委通讯地址：${this.formData.originalAddress}
联系电话：${this.formData.phone} 传真：${this.formData.fax} 邮编：${this.formData.postalCode}

回执联：
${this.formData.name}同志的党员组织关系已转达我处，特此回复。

经办人：${this.formData.processor} 联系电话：${this.formData.processorPhone}`;
    }
  }
}
</script>

<style scoped>
.preview-container {
  background: #f5f5f5;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.copy-section {
  text-align: center;
  margin-bottom: 20px;
}

.introduction-letter,
.receipt {
  background: white;
  padding: 30px;
  border: 2px solid #4e6ef2;
  margin-bottom: 20px;
  position: relative;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}

.letter-header,
.receipt-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.letter-header h2,
.receipt-header h3 {
  color: #d90000;
  margin-bottom: 10px;
}

.letter-number,
.receipt-number,
.receipt-part {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 14px;
  color: #666;
}

.receipt-part {
  left: 0;
  right: auto;
}

.letter-content,
.receipt-content {
  margin-bottom: 20px;
  line-height: 2;
}

.letter-footer,
.receipt-footer {
  text-align: right;
  margin-bottom: 20px;
}

.signature {
  margin-bottom: 10px;
  color: #666;
}

.contact-info,
.processor-info {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px dashed #ccc;
  font-size: 14px;
  color: #666;
}

.receipt-note {
  margin-top: 20px;
  font-size: 12px;
  color: #999;
  text-align: center;
}
</style>