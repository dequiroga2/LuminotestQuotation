import { useCallback, useState } from "react";

export interface CartItem {
  productId?: number;
  productName?: string;
  essayIds: number[];
  essayNames: string[];
}

export function useQuotationCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    // If it's a product with an ID, try to merge with existing product
    if (item.productId !== undefined) {
      setItems((prev) => {
        const existing = prev.findIndex((i) => i.productId === item.productId);
        if (existing !== -1) {
          return prev.map((i, idx) =>
            idx === existing
              ? {
                  ...i,
                  essayIds: Array.from(new Set([...i.essayIds, ...item.essayIds])),
                  essayNames: Array.from(new Set([...i.essayNames, ...item.essayNames])),
                }
              : i
          );
        }
        return [...prev, item];
      });
    } else {
      // For essays without productId, just add as new item
      setItems((prev) => [...prev, item]);
    }
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateEssays = useCallback((index: number, essayIds: number[], essayNames: string[]) => {
    setItems((prev) =>
      prev.map((i, idx) =>
        idx === index
          ? { ...i, essayIds, essayNames }
          : i
      )
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalEssays = useCallback(() => {
    return items.reduce((total, item) => total + (item.essayIds?.length || 0), 0);
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateEssays,
    clear,
    getTotalEssays,
  };
}
