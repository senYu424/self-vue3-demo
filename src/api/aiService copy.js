// src/api/aiService.js

const API_URL = 'https://api.deepseek.com/chat/completions'
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'sk-6f60713affcc497cb6bf2a00ce0b0e6d'

/**
 * 流式调用大模型（打字机效果）
 * @param {Array} messages - 消息历史数组
 * @param {Function} onChunk - 每收到一段文字就回调
 * @param {Function} onDone - 完成时回调
 */
export async function streamChat(messages, onChunk, onDone) {
  if (!API_KEY) {
    throw new Error('未配置 VITE_DEEPSEEK_API_KEY，请在项目根目录 .env 中设置')
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  const handleLine = (raw) => {
    const line = raw.replace(/\r$/, '').trim()
    if (!line) return false

    if (line === 'data: [DONE]') {
      return true
    }
    if (line.startsWith('data: ')) {
      try {
        const json = JSON.parse(line.slice(6))
        const text = json.choices?.[0]?.delta?.content
        if (text) onChunk(text)
      } catch {
        // 单行仍非合法 JSON 时忽略
      }
    }
    return false
  }

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      if (buffer.trim()) {
        if (handleLine(buffer)) {
          onDone?.()
          return
        }
      }
      break
    }

    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n')
    buffer = parts.pop() ?? ''

    for (const part of parts) {
      if (handleLine(part)) {
        onDone?.()
        return
      }
    }
  }

  onDone?.()
}
