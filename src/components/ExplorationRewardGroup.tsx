import { useTranslation } from "react-i18next";
import type { Language } from "../types/i18n";
import type { ItemSearchEntry } from "../types/items";
import { buildItemIconUrl } from "../utils/itemIcon";

type ExplorationRewardGroupProps = {
  title: string;
  itemIds: number[];
  itemsById: Map<number, ItemSearchEntry>;
};

export function ExplorationRewardGroup({
  title,
  itemIds,
  itemsById,
}: ExplorationRewardGroupProps) {
  const { t, i18n } = useTranslation();

  const language: Language = i18n.language === "fr" ? "fr" : "en";

  return (
    <section className="exploration-reward-group">
      <h3 className="exploration-section-title">{title}</h3>

      {itemIds.length > 0 ? (
        <ul className="exploration-reward-list">
          {itemIds.map((itemId) => {
            const item = itemsById.get(itemId);

            return (
              <li key={itemId} className="exploration-reward-item">
                {item && (
                  <img
                    src={buildItemIconUrl(item.iconId)}
                    alt=""
                    width="28"
                    height="28"
                  />
                )}

                <span>
                  {item?.name[language] ??
                    t("explorationVenture.unknownItem", { id: itemId })}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>{t("explorationVenture.noKnownRewards")}</p>
      )}
    </section>
  );
}
