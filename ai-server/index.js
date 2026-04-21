// ai-server/index.js

const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000' // 只允许你的Vue项目访问
}))

const API_KEY = process.env.API_KEY
const API_URL = 'https://api.deepseek.com/chat/completions'

// 普通问答接口
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`  // Key 在这里，前端看不到
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages
      })
    })

    const data = await response.json()
    res.json(data)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 流式接口（打字机效果）
app.post('/api/chat/stream', async (req, res) => {
  const { messages } = req.body

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        stream: true
      })
    })

    // 把大模型的流直接转发给前端
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      res.write(chunk)  // 直接转发
    }

    const tail = decoder.decode()
    if (tail) res.write(tail)

    res.end()

  } catch (err) {
    res.write(`data: {"error": "${err.message}"}\n\n`)
    res.end()
  }
})

const PORT = process.env.PORT || 3005
app.listen(PORT, () => {
  console.log(`✅ AI 代理服务启动：http://localhost:${PORT}`)
})
