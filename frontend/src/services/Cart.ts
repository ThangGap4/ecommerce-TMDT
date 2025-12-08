import api from "./api";

// Types
export interface ICartItem {
  id: number;
  product_id: number;
  product_name: string | null;
  product_image: string | null;
  product_slug: string | null;
  product_size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ICart {
  id: number;
  user_id: string;
  items: ICartItem[];
  subtotal: number;
  total: number;
}

export interface IAddToCartRequest {
  product_id: number;
  size: string;
  quantity: number;
}

// Get current user's cart
export const getCart = async (): Promise<ICart> => {
  const response = await api.get("/cart");
  return response.data;
};

// Add item to cart
export const addToCart = async (request: IAddToCartRequest): Promise<ICart> => {
  const response = await api.post("/cart", request);
  return response.data;
};

// Update cart item quantity
export const updateCartItem = async (cartItemId: number, quantity: number): Promise<ICart> => {
  const response = await api.put(`/cart/${cartItemId}`, { quantity });
  return response.data;
};

// Remove item from cart
export const removeFromCart = async (cartItemId: number): Promise<ICart> => {
  const response = await api.delete(`/cart/${cartItemId}`);
  return response.data;
};

// Clear entire cart
export const clearCart = async (): Promise<ICart> => {
  const response = await api.delete("/cart");
  return response.data;
};
