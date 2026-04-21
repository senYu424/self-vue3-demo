<!-- src/views/AiChat.vue -->
<template>
  <div class="chat-container">
    <!-- 顶部标题栏 -->
    <div class="chat-header">
      <span>🤖 AI 助手</span>
      <div class="header-actions">
        <button class="clear-btn" @click="clearMessages">清空对话</button>
        <button class="clear-btn" @click="clearSearchRecords">清空记录</button>
      </div>
    </div>

    <!-- 搜索记录 -->
    <div class="record-panel">
      <div class="record-title">
        <span>搜索记录（DeepSeek 请求回显）</span>
        <span class="record-count">{{ searchRecords.length }} 条</span>
      </div>
      <div v-if="searchRecords.length === 0" class="record-empty">暂无记录</div>
      <div v-else class="record-list">
        <div class="record-item" v-for="item in searchRecords" :key="item.id">
          <div class="record-meta">
            <span>{{ item.createdAt }}</span>
            <span :class="['record-status', item.status]">
              {{ item.status === 'done' ? '完成' : item.status === 'error' ? '失败' : '处理中' }}
            </span>
          </div>
          <div class="record-line"><strong>问题：</strong>{{ item.question }}</div>
          <div class="record-line"><strong>回答：</strong>{{ item.answer || '...' }}</div>
          <div class="record-line"><strong>请求：</strong>{{ JSON.stringify(item.requestPayload) }}</div>
          <div class="record-line"><strong>回显：</strong>{{ item.echoLines.slice(-3).join(' | ') || '-' }}</div>
        </div>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="message-list" ref="messageListRef">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message-item', msg.role]"
      >
        <!-- 头像 -->
        <div class="avatar">{{ msg.role === 'user' ? '我' : 'AI' }}</div>
        <!-- 内容 -->
        <div class="message-content">
          <span v-if="msg.role === 'assistant' && !msg.content && isLoading">
            <span class="typing-dot">●</span>
            <span class="typing-dot">●</span>
            <span class="typing-dot">●</span>
          </span>
          <!-- 渲染文本（如需 Markdown 可用 marked 库解析） -->
          <pre v-else>{{ msg.content }}</pre>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="messages.length === 0" class="empty-tip">
        👋 你好！有什么我可以帮你的吗？
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <textarea
        v-model="inputText"
        placeholder="输入你的问题... (Enter 发送，Shift+Enter 换行)"
        @keydown.enter.exact.prevent="sendMessage"
        :disabled="isLoading"
        rows="3"
      />
      <button
        class="send-btn"
        @click="sendMessage"
        :disabled="isLoading || !inputText.trim()"
      >
        {{ isLoading ? '回答中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useAiChat } from '../../composables/useAiChat'

const {
  messages,
  inputText,
  isLoading,
  searchRecords,
  sendMessage,
  clearMessages,
  clearSearchRecords
} = useAiChat()

// 消息列表自动滚动到底部
const messageListRef = ref(null)
watch(messages, async () => {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}, { deep: true })
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  background: #f5f5f5;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  font-weight: bold;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.clear-btn {
  font-size: 13px;
  color: #999;
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 4px 12px;
  cursor: pointer;
}

.record-panel {
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 10px 16px;
}

.record-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: #555;
}

.record-count {
  color: #999;
}

.record-empty {
  color: #999;
  font-size: 13px;
}

.record-list {
  max-height: 180px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.record-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px 10px;
  background: #fafafa;
  font-size: 12px;
  line-height: 1.5;
}

.record-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
}

.record-status.done {
  color: #07c160;
}

.record-status.error {
  color: #ff4d4f;
}

.record-status.loading {
  color: #4f9eff;
}

.record-line {
  color: #333;
  word-break: break-all;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.message-item.user {
  flex-direction: row-reverse; /* 用户消息靠右 */
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #4f9eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.message-item.user .avatar {
  background: #07c160;
}

.message-content {
  max-width: 70%;
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  line-height: 1.6;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.message-item.user .message-content {
  background: #07c160;
  color: #fff;
}

.message-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
}

.empty-tip {
  text-align: center;
  color: #999;
  margin-top: 60px;
  font-size: 15px;
}

.typing-dot {
  display: inline-block;
  animation: blink 1.2s infinite;
  margin: 0 2px;
  color: #999;
}
.typing-dot:nth-child(2) { animation-delay: 0.3s; }
.typing-dot:nth-child(3) { animation-delay: 0.6s; }

@keyframes blink {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}

.input-area {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #eee;
}

.input-area textarea {
  flex: 1;
  resize: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.input-area textarea:focus {
  border-color: #4f9eff;
}

.send-btn {
  width: 80px;
  background: #4f9eff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
