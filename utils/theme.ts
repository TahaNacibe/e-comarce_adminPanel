export function getTheme(): "light" | "dark" | "system" {
    if (typeof window === 'undefined') return 'system'
    
    return (localStorage.getItem("theme") as "light" | "dark" | "system") || "system"
  }