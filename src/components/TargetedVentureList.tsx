import { ItemSearchEntry } from "../types/items";
import { TargetedVenture } from "../types/ventures";

type TargetedVentureListProps = {
  ventures: TargetedVenture[];
  itemsById: Map<number, ItemSearchEntry>;
};

export function TargetedVentureList({
  ventures,
  itemsById,
}: TargetedVentureListProps) {
  return (
    <>
      {ventures?.map((venture) => {
        const item = itemsById?.get(venture.targetItemId);

        let itemName = "Loading item...";

        if (itemsById !== null) {
          itemName = item?.name.en ?? `Unknown item #${venture.targetItemId}`;
        }

        return (
          <div key={venture.id}>
            Venture #{venture.id} - {venture.retainerType} - {itemName}
          </div>
        );
      })}
    </>
  );
}
