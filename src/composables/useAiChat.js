// src/composables/useAiChat.js
import { ref } from 'vue'
import { streamChat } from '../api/aiService'

export function useAiChat() {
  const messages = ref([])      // 消息历史
  const inputText = ref('')     // 用户输入
  const isLoading = ref(false)  // 是否加载中
  const searchRecords = ref([]) // 搜索记录（请求 + 回显）

  // 发送消息
  async function sendMessage() {
    const content = inputText.value.trim()
    if (!content || isLoading.value) return

    // 添加用户消息
    messages.value.push({ role: 'user', content })
    inputText.value = ''

    const createdAt = new Date().toLocaleString()
    const record = {
      id: Date.now(),
      question: content,
      answer: '',
      status: 'loading',
      createdAt,
      requestPayload: null,
      echoLines: []
    }
    searchRecords.value.unshift(record)

    // 添加一个空的 AI 消息占位
    const aiMsg = { role: 'assistant', content: '' }
    messages.value.push(aiMsg)
    isLoading.value = true

    try {
      // 只传 role + content 给 API
      const apiMessages = messages.value
        .slice(0, -1) // 去掉最后那个空的 AI 消息
        .map(m => ({ role: m.role, content: m.content }))
      record.requestPayload = {
        model: 'deepseek-chat',
        messages: apiMessages,
        stream: true
      }

      await streamChat(
        apiMessages,
        (chunk) => {
          // 流式追加文字（打字机效果）
          aiMsg.content += chunk
          record.answer = aiMsg.content
        },
        () => {
          record.answer = aiMsg.content
          record.status = 'done'
          isLoading.value = false
        },
        (echo) => {
          if (record.echoLines.length < 30) {
            record.echoLines.push(echo)
          }
        }
      )
    } catch (err) {
      aiMsg.content = `❌ 请求失败：${err.message}`
      record.answer = aiMsg.content
      record.status = 'error'
      isLoading.value = false
    }
  }

  // 清空对话
  function clearMessages() {
    messages.value = []
  }

  function clearSearchRecords() {
    searchRecords.value = []
  }

  return {
    messages,
    inputText,
    isLoading,
    searchRecords,
    sendMessage,
    clearMessages,
    clearSearchRecords
  }
}
