// src/api/aiService.js



const API_KEY = ''  // 不再前端提供 key，留空或删除

const API_URL = 'http://localhost:3005/api/chat/stream' // 指向自己的 node 服务

// 如果用 OpenAI 就改成：https://api.openai.com/v1/chat/completions



/**

 * 流式调用大模型（打字机效果）

 * @param {Array} messages - 消息历史数组

 * @param {Function} onChunk - 每收到一段文字就回调

 * @param {Function} onDone - 完成时回调
 * @param {Function} onEcho - 接口回显（原始行）回调

 */

export async function streamChat(messages, onChunk, onDone, onEcho) {

  const response = await fetch(API_URL, {

    method: 'POST',

    headers: {

      'Content-Type': 'application/json',

    },

    body: JSON.stringify({

      model: 'deepseek-chat',   // 换成你用的模型名

      messages: messages,

      stream: true              // 开启流式输出

    })

  })



  if (!response.ok) {

    throw new Error(`API 请求失败: ${response.status}`)

  }



  const reader = response.body.getReader()

  const decoder = new TextDecoder()

  /** 累积未以换行结束的半行，避免在 JSON 半截上 parse */

  let buffer = ''



  const handleLine = (raw) => {

    const line = raw.replace(/\r$/, '').trim()

    if (!line) return false

    onEcho?.(line)



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


