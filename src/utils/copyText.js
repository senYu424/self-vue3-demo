/**
 * 一键复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} - 复制成功返回true，否则返回false
 */
export const copyText = (text) => {
  return new Promise((resolve) => {
    // 如果浏览器支持navigator.clipboard API，则使用它
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          // 如果API失败，尝试使用旧方法
          fallbackCopyText(text, resolve);
        });
    } else {
      // 如果不支持现代API，则使用旧方法
      fallbackCopyText(text, resolve);
    }
  });
};

/**
 * 降级方案：使用旧的document.execCommand方法
 * @param {string} text - 要复制的文本
 * @param {function} resolve - Promise的resolve函数
 */
function fallbackCopyText(text, resolve) {
  // 创建一个textarea元素
  const textarea = document.createElement('textarea');
  textarea.value = text;
  
  // 避免滚动到底部
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  textarea.style.zIndex = '-1000';
  
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  
  try {
    // 执行复制命令
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    resolve(successful);
  } catch (err) {
    console.error('复制失败', err);
    document.body.removeChild(textarea);
    resolve(false);
  }
}