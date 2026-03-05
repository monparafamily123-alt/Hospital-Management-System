// Centralized Toast Utility for the entire project
export const showToast = (message, type = 'success') => {
  // Remove any existing toasts to prevent duplicates
  const existingToasts = document.querySelectorAll('.toast-notification');
  existingToasts.forEach(toast => toast.remove());

  const toast = document.createElement('div');
  toast.className = `toast-notification fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 translate-x-0 opacity-100`;
  
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };
  
  const icons = {
    success: '✅',
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `
    <div class="${colors[type]} border rounded-lg shadow-lg p-4 flex items-start space-x-3">
      <div class="flex-shrink-0 text-lg">${icons[type]}</div>
      <div class="flex-1">
        <p class="text-sm font-medium">${message}</p>
      </div>
      <button class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors" onclick="this.parentElement.parentElement.remove()">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }
  }, 5000);
};

// Convenience methods
export const showSuccess = (message) => showToast(message, 'success');
export const showError = (message) => showToast(message, 'error');
export const showWarning = (message) => showToast(message, 'warning');
export const showInfo = (message) => showToast(message, 'info');
