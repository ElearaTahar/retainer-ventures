import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { RetainerBellIcon } from "./icons/RetainerBellIcon";

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

  const location = useLocation();
  const navigationRef = useRef<HTMLElement>(null);

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
  });

  const [isScrolled, setIsScrolled] = useState(false);

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

  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  function navigateToVentures(event: React.MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    startTransition(() => {
      navigate("/ventures");
    });
  }

  const [isRinging, setIsRinging] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.top = "0";
    sentinel.style.height = "1px";
    sentinel.style.pointerEvents = "none";

    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(([entry]) => {
      setIsScrolled(!entry.isIntersecting);
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  useLayoutEffect(() => {
    const navigation = navigationRef.current;
    if (!navigation) return;

    function updateIndicator() {
      if (!navigation) return;

      const activeLink = navigation.querySelector<HTMLAnchorElement>(
        'a[aria-current="page"]',
      );
      if (!activeLink) return;

      const navigationRect = navigation.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      setIndicator({
        left: linkRect.left - navigationRect.left,
        width: linkRect.width,
      });
    }

    updateIndicator();

    const observer = new ResizeObserver(updateIndicator);
    observer.observe(navigation);

    return () => observer.disconnect();
  }, [location.pathname, i18n.language]);

  return (
    <header
      className={`app-header${isScrolled ? " app-header--scrolled" : ""}`}
    >
      <div className="app-header-content">
        <div className="app-title-logo">
          <button
            className="app-logo-button"
            type="button"
            aria-label={t("navigation.bell")}
            onClick={() => {
              if (
                !isRinging &&
                !window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ) {
                setIsRinging(true);
              }

              if (audioRef.current === null) {
                audioRef.current = new Audio("/sounds/retainer-bell.wav");
                audioRef.current.volume = 0.3;
              }

              audioRef.current.currentTime = 0;
              void audioRef.current.play().catch(() => {});
            }}
            onAnimationEnd={(event) => {
              if (event.animationName === "loading-bell-vibrate") {
                setIsRinging(false);
              }
            }}
          >
            <RetainerBellIcon
              className={`app-logo ${isRinging ? "ringing-bell" : ""}`}
              aria-hidden="true"
            />
          </button>

          <NavLink
            className="app-title"
            to="/ventures"
            aria-label={t("appTitle")}
          >
            <span className="app-title-text">
              <span className="app-title-prefix">FFXIV</span>
              <span className="app-title-name">Retainer Ventures</span>
            </span>
          </NavLink>
        </div>

        <nav
          ref={navigationRef}
          className="app-navigation"
          aria-label={t("navigation.main")}
        >
          <NavLink
            to="/ventures"
            onClick={navigateToVentures}
            aria-busy={isPending}
            className={isPending ? "navigation-link--pending" : undefined}
          >
            {t("navigation.ventures")}
          </NavLink>
          <NavLink to="/retainers">{t("navigation.retainers")}</NavLink>

          <span
            className="app-navigation-indicator"
            aria-hidden="true"
            style={{ left: indicator.left, width: indicator.width }}
          />
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
