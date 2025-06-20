
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    console.log('Theme toggle clicked, current theme:', theme);
    toggleTheme();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="bg-black/30 dark:bg-white/20 backdrop-blur-sm border-gray-600 dark:border-gray-400 transition-all hover:bg-black/50 dark:hover:bg-white/30 text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-100 shadow-lg"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 transition-all" />
      ) : (
        <Sun className="h-4 w-4 transition-all" />
      )}
    </Button>
  );
};

export default ThemeToggle;
