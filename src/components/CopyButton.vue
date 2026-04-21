<template>
  <button 
    class="copy-button" 
    :class="{ 'copied': copied }"
    @click="handleCopy"
    :title="tooltipText"
  >
    <span class="copy-icon" :class="{ 'copying': copying }">
      <svg 
        :width="iconSize" 
        :height="iconSize" 
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          v-if="copied && !copying" 
          d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.58 5.59L9 16.17Z" 
          fill="currentColor" 
        />
        <path 
          v-else 
          d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" 
          fill="currentColor" 
        />
      </svg>
    </span>
    <span class="copy-text">{{ buttonText }}</span>
  </button>
</template>

<script>
import { copyText } from '../utils/copyText';
import { ref, computed } from 'vue';

export default {
  name: 'CopyButton',
  props: {
    text: {
      type: String,
      required: true,
      default: ''
    },
    successText: {
      type: String,
      default: '已复制'
    },
    defaultText: {
      type: String,
      default: '复制'
    },
    size: {
      type: Number,
      default: 16
    },
    showText: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const copied = ref(false);
    const copying = ref(false);

    const copyTextToClipboard = async () => {
      copying.value = true;
      const result = await copyText(props.text);
      copied.value = result;
      copying.value = false;

      if (result) {
        // 2秒后恢复默认状态
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      }
    };

    const buttonText = computed(() => {
      if (!props.showText) return '';
      return copied.value ? props.successText : props.defaultText;
    });

    const tooltipText = computed(() => {
      return copied.value ? props.successText : props.defaultText;
    });

    const iconSize = computed(() => {
      return props.size;
    });

    return {
      copied,
      copying,
      buttonText,
      tooltipText,
      iconSize,
      handleCopy: copyTextToClipboard
    };
  }
};
</script>

<style scoped>
.copy-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #f0f2f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
  user-select: none;
}

.copy-button:hover {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}

.copy-button.copied {
  background: #f6ffed;
  border-color: #52c41a;
  color: #52c41a;
}

.copy-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-icon.copying {
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.copy-text {
  font-weight: 500;
}
</style>