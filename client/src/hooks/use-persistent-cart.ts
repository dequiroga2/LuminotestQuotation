import { useCallback, useEffect, useState } from "react";
import { useFirebaseAuth } from "./use-firebase-auth";

export interface CartItem {
  id?: number; // Database ID for removal
  productId?: number;
  productName?: string;
  essayIds: number[];
  essayNames: string[];
  quantity?: number; // Quantity of this item
}

export function usePersistentCart() {
  const { user, token } = useFirebaseAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from backend on mount
  useEffect(() => {
    if (token) {
      loadCart();
    }
  }, [token]);

  const loadCart = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    console.log("Loading cart for user:", user?.uid || 'dev-user');
    try {
      const res = await fetch("/api/cart", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Cart loaded successfully:", data.length, "items");
        setItems(data);
      } else {
        const error = await res.text();
        console.error("Error loading cart:", error);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  const addItem = useCallback(async (item: Omit<CartItem, "id">) => {
    if (!token) return;
    
    console.log("Adding item to cart:", item);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        const newItem = await res.json();
        console.log("Item added successfully:", newItem);
        setItems((prev) => [...prev, newItem]);
      } else {
        const error = await res.text();
        console.error("Error response from server:", error);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  }, [token]);

  const removeItem = useCallback(async (id: number) => {
    if (!token) return;
    
    console.log("Removing item from cart:", id);

    try {
      const res = await fetch(`/api/cart/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        console.log("Item removed successfully:", id);
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        const error = await res.text();
        console.error("Error removing item from cart:", error);
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  }, [token]);

  const clear = useCallback(async () => {
    if (!token) return;
    
    console.log("Clearing cart for user:", user?.uid || 'dev-user');

    try {
      const res = await fetch("/api/cart", { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        console.log("Cart cleared successfully");
        setItems([]);
      } else {
        const error = await res.text();
        console.error("Error clearing cart:", error);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  }, [user, token]);

  const getTotalEssays = useCallback(() => {
    return items.reduce((total, item) => total + (item.essayIds?.length || 0) * (item.quantity || 1), 0);
  }, [items]);

  const updateQuantity = useCallback(async (id: number, quantity: number) => {
    if (quantity < 1 || !token) return;
    
    console.log("Updating item quantity - ID:", id, "Quantity:", quantity);
    
    try {
      const res = await fetch(`/api/cart/${id}/quantity`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });
      
      if (res.ok) {
        console.log("Quantity updated successfully");
        setItems((prev) => 
          prev.map((item) => 
            item.id === id ?{ ...item, quantity } : item
          )
        );
      } else {
        const error = await res.text();
        console.error("Error updating quantity:", error);
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  }, [token]);

  return {
    items,
    addItem,
    removeItem,
    clear,
    getTotalEssays,
    updateQuantity,
    isLoading,
  };
}
