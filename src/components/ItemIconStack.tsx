import { buildItemIconUrl } from "../utils/itemIcon";
import "../styles/item-icon-stack.css";

type ItemIconStackProps = {
  iconIds: number[];
};

export function ItemIconStack({ iconIds }: ItemIconStackProps) {
  if (iconIds.length === 0) {
    return null;
  }

  const displayedIcons = iconIds.slice(0, 2);

  return (
    <span
      className={`item-icon-stack ${
        displayedIcons.length === 1 ? "item-icon-stack--single" : ""
      }`}
      aria-hidden="true"
    >
      {displayedIcons.map((iconId, index) => (
        <img key={`${iconId}-${index}`} src={buildItemIconUrl(iconId)} alt="" />
      ))}
    </span>
  );
}
