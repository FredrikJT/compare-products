import { CompareProductItem, Item } from "../types/common";

export function createProducts(data: Item[][]): CompareProductItem[] {
  if (!data.length) return [];

  return data.flatMap((rawItems) => {
    if (!rawItems.length) return [];
    const itemsByNameRecord = mapItemsByName(rawItems);
    const itemsWithChildren = addChildrenToItems(itemsByNameRecord);
    return removeParents(itemsWithChildren);
  });
}

function removeParents(
  itemsWithChildren: CompareProductItem[]
): CompareProductItem[] {
  const removeParentRecursive = (item: CompareProductItem) => {
    delete item.parent;
    delete item.parentName;
    item.children.forEach(removeParentRecursive);
  };

  itemsWithChildren.forEach(removeParentRecursive);
  return itemsWithChildren;
}

function addChildrenToItems(
  itemsByName: Record<string, CompareProductItem>
): CompareProductItem[] {
  Object.values(itemsByName).forEach((item) => {
    if (item.parentName && itemsByName[item.parentName]) {
      const parent = itemsByName[item.parentName];
      parent.children.push(item);
      item.parent = parent;
    }
  });

  // Extract top-level items (no parent)
  const topLevelItems = Object.values(itemsByName).filter(
    (item) => !item.parentName
  );
  return topLevelItems;
}

function mapItemsByName(items: Item[]): Record<string, CompareProductItem> {
  const itemsByName: Record<string, CompareProductItem> = {};
  items.forEach((item) => {
    const name = item.name;
    if (name) {
      itemsByName[name] = {
        name,
        type: item.type,
        quantity: item.quantity,
        price: item.price || 0,
        failureRate: item.failureRate || 0,
        description: item.description || "",
        parentName: item.parent || null,
        children: [],
        get totalCost() {
          return calculateTotalCost(this);
        },
      };
    }
  });
  return itemsByName;
}

function calculateItemCost(item: CompareProductItem): number {
  return item.quantity * item.price * item.failureRate;
}

function calculateTotalCost(item: CompareProductItem): number {
  let totalCost = calculateItemCost(item);
  item.children.forEach((child) => {
    totalCost += calculateTotalCost(child);
  });
  return totalCost;
}
