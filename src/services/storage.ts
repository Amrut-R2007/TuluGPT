// Clean local cache storage for client-side preferences (theme, UI states)
// Strictly ZERO simulated users or mock data fallbacks

const STORAGE_KEYS = {
  ACTIVE_TAB: 'tulugpt_active_tab',
};

export const LocalStore = {
  getActiveTab(defaultTab: string = 'chat'): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) || defaultTab;
    } catch (e) {
      return defaultTab;
    }
  },

  setActiveTab(tab: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
    } catch (e) {
      console.warn('LocalStorage write warning:', e);
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB);
    } catch (e) {
      console.warn('LocalStorage clear warning:', e);
    }
  }
};
