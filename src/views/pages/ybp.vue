<template>
  <div class="gauge-container">
    <div 
      class="gauge-card"
      @click="handleRefresh"
      title="点击刷新数据"
    >
      <svg viewBox="0 0 500 500" class="gauge-svg">
        <defs>
          <mask id="angularMask">
            <path
              :d="describeArc(cx, cy, 160, startAngle, currentAngle)"
              fill="none"
              stroke="#FFFFFF"
              stroke-opacity="0.8"
              stroke-width="80"
            />
            <path
              :d="describeArc(cx, cy, 225, startAngle, currentAngle)"
              fill="none"
              stroke="#FFFFFF"
              stroke-width="3"
              stroke-linecap="round"
            />
          </mask>

          <!-- 中心内发光渐变 - 边缘亮，中心暗，完美模拟玻璃凹陷或凸起质感 -->
          <radialGradient id="centerInnerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="40%" stop-color="#030a1c" stop-opacity="0.5" />
            <stop offset="85%" :stop-color="risk.secondary" stop-opacity="0.4" />
            <stop offset="100%" :stop-color="risk.primary" stop-opacity="0.9" />
          </radialGradient>

          <!-- 中心外发光滤镜 -->
          <filter id="centerOuterGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
          </filter>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- ================= 图层1: 底层装饰与暗色轨道 ================= -->
        <path
          :d="describeArc(cx, cy, 225, startAngle, startAngle + totalAngle)"
          fill="none"
          :stroke="risk.bgTrack"
          stroke-opacity="0.2"
          stroke-width="3"
          stroke-linecap="round"
          class="transition-colors"
        />
        <path
          :d="describeArc(cx, cy, 160, startAngle, startAngle + totalAngle)"
          fill="none"
          :stroke="risk.bgTrack"
          stroke-opacity="0.2"
          stroke-width="80" 
          class="transition-colors"
        />

        <!-- ================= 图层2: 动态进度条与光轨 (角度渐变) ================= -->
        <foreignObject x="0" y="0" width="500" height="500" mask="url(#angularMask)">
          <div 
            xmlns="http://www.w3.org/1999/xhtml"
            class="gradient-bg transition-all"
            :style="gradientStyle"
          />
        </foreignObject>

        <!-- ================= 图层3: 内圈发光圆盘 ================= -->
        <!-- 1. 中心外发光层 (光晕扩散到外侧) -->
        <circle 
          :cx="cx" 
          :cy="cy" 
          r="90" 
          fill="none"
          :stroke="risk.primary"
          stroke-width="10"
          opacity="0.4"
          filter="url(#centerOuterGlowFilter)"
          class="transition-colors"
        />
        
        <!-- 2. 底色遮罩圆盘 (阻挡底层光线穿透，保持中心清晰) -->
        <circle :cx="cx" :cy="cy" r="90" fill="#030a1c" opacity="0.9" />
        
        <!-- 3. 内发光层 (使用刚才定义的向内渗透渐变模拟，透明度设为0.5) -->
        <circle :cx="cx" :cy="cy" r="90" fill="url(#centerInnerGlow)" opacity="0.5" />
        
        <!-- 4. 清晰的内圈高光边界描边 -->
        <circle 
          :cx="cx" 
          :cy="cy" 
          r="90" 
          fill="none"
          :stroke="risk.primary"
          stroke-width="2"
          opacity="0.6"
          class="transition-colors"
        />

        <!-- ================= 图层4: 刻度、数字与发光点 ================= -->
        <g>
          <template v-for="tick in ticks" :key="tick.key">
            <line
              v-if="tick.type === 'line'"
              :x1="tick.x1"
              :y1="tick.y1"
              :x2="tick.x2"
              :y2="tick.y2"
              :stroke="tick.stroke"
              :stroke-width="tick.strokeWidth"
              stroke-linecap="round"
              class="transition-colors"
            />
            <text
              v-else-if="tick.type === 'text'"
              :x="tick.x"
              :y="tick.y"
              :fill="tick.fill"
              font-size="18"
              font-weight="500"
              font-family="system-ui, sans-serif"
              text-anchor="middle"
              dominant-baseline="middle"
              class="transition-colors"
            >
              {{ tick.value }}
            </text>
          </template>
        </g>
        
        <!-- 光轨末端发光点 -->
        <circle
          :cx="endDotPos.x"
          :cy="endDotPos.y"
          r="5"
          fill="#FFFFFF"
          :stroke="risk.primary"
          stroke-width="2"
          filter="url(#glow)"
          class="transition-colors"
        />

        <!-- ================= 图层5: 联动的指针与核心文本 ================= -->
        <g :transform="`rotate(${currentAngle}, ${cx}, ${cy})`">
          <polygon 
            :points="`${cx + 90},${cy - 8} ${cx + 110},${cy} ${cx + 90},${cy + 8}`" 
            fill="#FFFFFF" 
            opacity="0.95"
          />
        </g>

        <text
          :x="cx"
          :y="cy + 15"
          fill="#FFFFFF"
          font-size="75"
          font-weight="300"
          font-family="system-ui, -apple-system, sans-serif"
          text-anchor="middle"
          dominant-baseline="middle"
          style="font-variant-numeric: tabular-nums"
        >
          {{ currentRoundedValue }}
        </text>
        
        <!-- ================= 状态标识底部模块 ================= -->
        <rect 
          :x="cx - 75" 
          :y="cy + 160" 
          width="150" 
          height="36" 
          rx="18" 
          :fill="risk.secondary" 
          opacity="0.3" 
          class="transition-colors"
        />
        <text
          :x="cx"
          :y="cy + 178"
          :fill="risk.primary"
          font-size="16"
          font-weight="600"
          letter-spacing="2"
          text-anchor="middle"
          dominant-baseline="middle"
          class="transition-colors"
        >
          {{ risk.label }}
        </text>
      </svg>

      <div class="refresh-hint">
        点击随机刷新
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ==========================================
// 辅助数学与SVG函数
// ==========================================

// 将极坐标（角度+半径）转换为笛卡尔坐标（x, y）
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  }
}

// 生成SVG Arc圆弧的路径字符串（d属性）
function describeArc(x, y, radius, startAngle, endAngle) {
  let sweep = endAngle - startAngle
  if (sweep <= 0) sweep = 0.01

  if (sweep > 179.9) {
    const midAngle = startAngle + sweep / 2
    const start = polarToCartesian(x, y, radius, startAngle)
    const mid = polarToCartesian(x, y, radius, midAngle)
    const end = polarToCartesian(x, y, radius, startAngle + sweep)

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, 0, 1, mid.x, mid.y,
      "A", radius, radius, 0, 0, 1, end.x, end.y
    ].join(" ")
  } else {
    const start = polarToCartesian(x, y, radius, startAngle)
    const end = polarToCartesian(x, y, radius, startAngle + sweep)

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, 0, 1, end.x, end.y
    ].join(" ")
  }
}

// ==========================================
// 风险等级状态配置
// ==========================================
const getRiskConfig = (val) => {
  // 0-25 为无风险蓝色
  if (val <= 25) {
    return {
      label: '无风险',
      primary: '#38bdf8',
      secondary: '#2563eb',
      dark: '#1e3a8a',
      bgTrack: '#007FFF',
      tickTextDark: '#3b82f6'
    }
  } 
  // 26-50 为低风险绿色
  else if (val <= 50) {
    return {
      label: '低风险',
      primary: '#34d399',
      secondary: '#10b981',
      dark: '#064e3b',
      bgTrack: '#10b981',
      tickTextDark: '#059669'
    }
  } 
  // 51-75 为中风险橙色
  else if (val <= 75) {
    return {
      label: '中风险',
      primary: '#fbbf24',
      secondary: '#f59e0b',
      dark: '#78350f',
      bgTrack: '#f59e0b',
      tickTextDark: '#d97706'
    }
  } 
  // 76-100 为高风险红色
  else {
    return {
      label: '高风险',
      primary: '#f87171',
      secondary: '#ef4444',
      dark: '#7f1d1d',
      bgTrack: '#ef4444',
      tickTextDark: '#dc2626'
    }
  }
}

// ==========================================
// 响应式数据
// ==========================================
const displayValue = ref(0)
const targetValue = ref(40)

// 仪表盘参数
const cx = 250
const cy = 250
const startAngle = 150
const totalAngle = 240
const maxVal = 100

// 计算属性
const currentRoundedValue = computed(() => Math.round(displayValue.value))
const currentAngle = computed(() => startAngle + (Math.max(displayValue.value, 0.1) / maxVal) * totalAngle)
const risk = computed(() => getRiskConfig(currentRoundedValue.value))

const endDotPos = computed(() => polarToCartesian(cx, cy, 225, currentAngle.value))

const gradientStyle = computed(() => ({
  width: '100%',
  height: '100%',
  background: `conic-gradient(from 240deg at 50% 50%, ${risk.value.dark} 0deg, ${risk.value.secondary} 120deg, ${risk.value.primary} 240deg, transparent 240deg)`
}))

// 刻度线和数字的生成
const ticks = computed(() => {
  const result = []
  for (let i = 0; i <= 100; i += 2) {
    const isMajor = i % 10 === 0
    const tickAngle = startAngle + (i / 100) * totalAngle
    const isActive = i <= displayValue.value

    const r1 = isMajor ? 190 : 200
    const r2 = 210
    const p1 = polarToCartesian(cx, cy, r1, tickAngle)
    const p2 = polarToCartesian(cx, cy, r2, tickAngle)

    result.push({
      type: 'line',
      key: `tick-${i}`,
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      stroke: isActive ? "#FFFFFF" : risk.value.dark,
      strokeWidth: isMajor ? 2.5 : 1.5
    })

    if (isMajor) {
      const textPos = polarToCartesian(cx, cy, 160, tickAngle)
      result.push({
        type: 'text',
        key: `text-${i}`,
        x: textPos.x,
        y: textPos.y,
        fill: isActive ? "#FFFFFF" : risk.value.tickTextDark,
        value: i
      })
    }
  }
  return result
})

// ==========================================
// 方法
// ==========================================
const handleRefresh = () => {
  targetValue.value = Math.floor(Math.random() * 101)
}

// ==========================================
// 生命周期钩子
// ==========================================
let intervalId = null
let animationFrameId = null

onMounted(() => {
  // 模拟真实场景下的数据实时推送
  intervalId = setInterval(() => {
    targetValue.value = Math.floor(Math.random() * 101)
  }, 2500)

  // 使用 requestAnimationFrame 实现平滑数值过渡
  const renderLoop = () => {
    const diff = targetValue.value - displayValue.value
    const next = displayValue.value + diff * 0.05
    
    if (Math.abs(diff) < 0.1) {
      displayValue.value = targetValue.value
    } else {
      displayValue.value = next
    }
    
    animationFrameId = requestAnimationFrame(renderLoop)
  }
  
  renderLoop()
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
.gauge-container {
  min-height: 100vh;
  background: #030a1c;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  user-select: none;
  font-family: system-ui, -apple-system, sans-serif;
}

.gauge-card {
  position: relative;
  background: rgba(8, 18, 44, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(30, 58, 138, 0.3);
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.8);
  border-radius: 1.5rem;
  padding: 2.5rem;
  cursor: pointer;
  transition: all 0.5s ease;
}

.gauge-card:hover {
  box-shadow: 0 30px 60px -15px rgba(0, 20, 50, 0.9);
}

.gauge-svg {
  width: 100%;
  max-width: 450px;
  height: auto;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.transition-colors {
  transition: stroke 0.5s ease, fill 0.5s ease, stop-color 0.5s ease;
}

.transition-all {
  transition: all 0.5s ease;
}

.gradient-bg {
  transition: background 0.5s ease;
}

.refresh-hint {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 0.75rem;
  color: #64748b;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gauge-card:hover .refresh-hint {
  opacity: 1;
}
</style>
