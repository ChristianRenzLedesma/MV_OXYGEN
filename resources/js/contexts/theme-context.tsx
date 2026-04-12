import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    applyTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');

    const applyTheme = (themeToApply: Theme) => {
        const root = document.documentElement;
        
        // Remove existing theme classes
        root.classList.remove('light', 'dark');
        
        // Apply new theme
        if (themeToApply === 'dark') {
            root.classList.add('dark');
        } else if (themeToApply === 'light') {
            root.classList.add('light');
        } else if (themeToApply === 'system') {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(prefersDark ? 'dark' : 'light');
        }
        
        // Save to localStorage
        localStorage.setItem('theme', themeToApply);
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        applyTheme(newTheme);
        
        // Save to backend (optional - could be debounced)
        const data = new FormData();
        data.append('theme', newTheme);
        
        // Use fetch to save to backend without page navigation
        fetch('/user/settings/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ theme: newTheme }),
        }).catch(error => {
            console.error('Failed to save theme preference:', error);
        });
    };

    useEffect(() => {
        // Load theme from localStorage on mount
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            setThemeState(savedTheme);
            applyTheme(savedTheme);
        } else {
            // Default to system preference
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setThemeState('system');
            applyTheme('system');
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, applyTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
