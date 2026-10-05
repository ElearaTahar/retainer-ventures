import { useTranslation } from "react-i18next";
import { Breadcrumb } from "../components/Breadcrumb";
import type { QuickVenture } from "../types/ventures";
import type { Language } from "../types/i18n";
import type { QuickRewards } from "../types/ventureRewards";
import type { ItemSearchEntry } from "../types/items";
import { buildItemIconUrl } from "../utils/itemIcon";

type QuickExplorationPageProps = {
  venture: QuickVenture;
  rewards: QuickRewards;
  itemsById: Map<number, ItemSearchEntry>;
};

export function QuickExplorationPage({
  venture,
  rewards,
  itemsById,
}: QuickExplorationPageProps) {
  const { t, i18n } = useTranslation();

  const language: Language = i18n.language === "fr" ? "fr" : "en";

  const durationHours = venture.durationMinutes / 60;

  const itemIds = rewards.rewards.knownItems;

  return (
    <>
      <Breadcrumb
        items={[
          {
            label: t("navigation.ventures"),
            to: "/ventures",
          },
          {
            label: venture.name[language],
          },
        ]}
      />

      <h1>{venture.name[language]}</h1>

      <p>{t("quickExplorationVenture.description")}</p>

      <p>
        {t("durationHours", { count: durationHours })} •{" "}
        {t("ventureCost", { count: venture.ventureCost })}
      </p>

      <section>
        <h2>{t("quickExplorationVenture.knownRewards")}</h2>

        <p>{t("quickExplorationVenture.communityRewardsNotice")}</p>

        {itemIds.length > 0 ? (
          <ul>
            {itemIds.map((itemId) => {
              const item = itemsById.get(itemId);

              return (
                <li key={itemId}>
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
                      t("quickExplorationVenture.unknownItem", { id: itemId })}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>{t("quickExplorationVenture.noKnownRewards")}</p>
        )}
      </section>
    </>
  );
}
