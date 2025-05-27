import { toast as reactHotToast } from 'react-hot-toast';

// Add missing info method to toast
const toast = {
  ...reactHotToast,
  info: (message: string) => reactHotToast(message, {
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
    }
  })
};

export default toast;