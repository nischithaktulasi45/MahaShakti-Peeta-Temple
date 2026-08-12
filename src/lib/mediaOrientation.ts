export type MediaOrientation = "landscape" | "portrait";

export function sortMediaByOrientation<T>(
  items: T[],
  getOrientation: (item: T) => MediaOrientation | undefined,
): T[] {
  return items
    .map((item, index) => ({ item, index, orientation: getOrientation(item) }))
    .sort((a, b) => {
      const aPortrait = a.orientation === "portrait";
      const bPortrait = b.orientation === "portrait";

      if (aPortrait === bPortrait) {
        return a.index - b.index;
      }

      return aPortrait ? 1 : -1;
    })
    .map(({ item }) => item);
}
