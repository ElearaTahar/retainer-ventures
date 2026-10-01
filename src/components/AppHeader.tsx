import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

type Theme = "light" | "dark";

export function AppHeader() {
  const { t, i18n } = useTranslation();

  const [systemTheme, setSystemTheme] = useState<Theme>(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );
  const [themeOverrride, setThemeOverride] = useState<Theme | null>(() => {
    const storedTheme = localStorage.getItem("theme");

    return storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : null;
  });

  const effectiveTheme = themeOverrride !== null ? themeOverrride : systemTheme;

  const nextTheme = effectiveTheme === "dark" ? "light" : "dark";
  const nextThemeLabel = t(`header.themes.${nextTheme}`);

  function toggleTheme() {
    if (nextTheme === systemTheme) {
      setThemeOverride(null);
    } else {
      setThemeOverride(nextTheme);
    }
  }

  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange(event: MediaQueryListEvent) {
      setSystemTheme(event.matches ? "dark" : "light");
    }

    darkModeQuery.addEventListener("change", handleChange);

    return () => {
      darkModeQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (themeOverrride === null) {
      root.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    } else {
      root.dataset.theme = themeOverrride;
      localStorage.setItem("theme", themeOverrride);
    }
  }, [themeOverrride]);

  return (
    <header className="app-header">
      <div className="app-header-content">
        <span className="app-title">{t("appTitle")}</span>

        <nav className="app-navigation" aria-label={t("navigation.main")}>
          <NavLink to="/ventures">{t("navigation.ventures")}</NavLink>
          <NavLink to="/retainers">{t("navigation.retainers")}</NavLink>
        </nav>

        <div className="app-header-actions">
          <select
            className="language-select"
            value={i18n.language}
            onChange={(event) => {
              const language = event.target.value;

              localStorage.setItem("language", language);
              i18n.changeLanguage(language);
            }}
            aria-label={t("header.language")}
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>

          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={t("header.switchTheme", { theme: nextThemeLabel })}
            title={t("header.switchTheme", { theme: nextThemeLabel })}
          >
            <span className="theme-toggle-icons" aria-hidden="true">
              <svg
                className={`theme-toggle-icon ${
                  nextTheme === "light" ? "theme-toggle-icon--visible" : ""
                }`}
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 2v2 M12 20v2 M4.93 4.93l1.42 1.42 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M4.93 19.07l1.42-1.42 M17.66 6.34l1.41-1.41"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <svg
                className={`theme-toggle-icon ${
                  nextTheme === "dark" ? "theme-toggle-icon--visible" : ""
                }`}
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
