import { useState, useRef, useEffect } from "react";
import { type Theme, getThemesByCategory, applyTheme } from "../themes";
import "./ThemeSelector.css";

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onSecretTap?: () => void;
}

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
  onSecretTap,
}: ThemeSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { dark, light } = getThemesByCategory();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function select(theme: Theme) {
    applyTheme(theme);
    onThemeChange(theme);
    setOpen(false);
  }

  return (
    <div className="theme-selector" ref={ref}>
      <button
        className="theme-trigger"
        onClick={() => { setOpen(!open); onSecretTap?.(); }}
        aria-label="Change theme"
      >
        <span
          className="swatch-preview"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary} 50%, ${currentTheme.colors.complement} 50%)`,
          }}
        />
      </button>

      {open && (
        <div className="theme-dropdown">
          <div className="theme-category">
            <span className="theme-category-label">Dark</span>
            <div className="theme-grid">
              {dark.map((t) => (
                <button
                  key={t.id}
                  className={`theme-option ${t.id === currentTheme.id ? "selected" : ""}`}
                  onClick={() => select(t)}
                  title={t.name}
                >
                  <span
                    className="theme-swatch"
                    style={{
                      background: `linear-gradient(135deg, ${t.colors.primary} 50%, ${t.colors.complement} 50%)`,
                    }}
                  />
                  <span className="theme-name">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="theme-category">
            <span className="theme-category-label">Light</span>
            <div className="theme-grid">
              {light.map((t) => (
                <button
                  key={t.id}
                  className={`theme-option ${t.id === currentTheme.id ? "selected" : ""}`}
                  onClick={() => select(t)}
                  title={t.name}
                >
                  <span
                    className="theme-swatch"
                    style={{
                      background: `linear-gradient(135deg, ${t.colors.primary} 50%, ${t.colors.complement} 50%)`,
                    }}
                  />
                  <span className="theme-name">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
