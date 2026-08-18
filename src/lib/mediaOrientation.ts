export type MediaOrientation = "landscape" | "portrait" | "square" | "vertical";

const orientationOrder: Record<MediaOrientation, number> = {
  landscape: 0,
  square: 1,
  portrait: 2,
  vertical: 3,
};

export function sortMediaByOrientation<T>(
  items: T[],
  getOrientation: (item: T) => MediaOrientation | undefined,
): T[] {
  return items
    .map((item, index) => ({ item, index, orientation: getOrientation(item) }))
    .sort((a, b) => {
      const aOrder = a.orientation ? orientationOrder[a.orientation] : 0;
      const bOrder = b.orientation ? orientationOrder[b.orientation] : 0;

      if (aOrder === bOrder) {
        return a.index - b.index;
      }

      return aOrder - bOrder;
    })
    .map(({ item }) => item);
}
