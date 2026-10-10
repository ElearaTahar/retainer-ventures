import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/back-to-top-button.css";

export function BackToTopButton() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    const threshold = 25;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.matchMedia("(max-width: 700px)").matches;

      if (currentScrollY <= 500) {
        setVisible(false);
      } else if (!isMobile) {
        setVisible(true);
      } else {
        const difference = currentScrollY - previousScrollY;

        if (Math.abs(difference) >= threshold) {
          setVisible(difference < 0);
          previousScrollY = currentScrollY;
        }
      }

      if (!isMobile || currentScrollY <= 500) {
        previousScrollY = currentScrollY;
      }
    };

    updateVisibility();

    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  if (!visible) {
    return null;
  }

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  };

  return (
    <button
      type="button"
      className="back-to-top-button"
      onClick={scrollToTop}
      title={t("navigation.backToTop")}
    >
      <ArrowUp size={18} aria-hidden="true" />
      <span>{t("navigation.backToTop")}</span>
    </button>
  );
}
