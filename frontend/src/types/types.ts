export interface IProduct {
  id: number;
  product_id: string;  // Keep for backward compatibility, will be set from id
  product_type: string;
  product_name: string;
  price: number;
  sale_price: number;
  blurb: string;
  stock: number;
  image_url: string;
  slug?: string;
}

export class Product implements IProduct {
  id: number;
  product_id: string;
  product_type: string;
  product_name: string;
  sale_price: number;
  price: number;
  blurb: string;
  stock: number;
  image_url: string;
  slug?: string;

  constructor(product: any) {
    this.id = product.id;
    this.product_id = String(product.id);  // Use id as string for product_id
    this.product_type = product.product_type;
    this.product_name = product.product_name;
    this.price = product.price;
    this.sale_price = product.sale_price;
    this.blurb = product.blurb;
    this.stock = product.stock;
    this.image_url = product.image_url;
    this.slug = product.slug;
  }
}

export interface IOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
}

export interface IOrder {
  id: number;
  user_id: number;
  created_at: Date;
  items: IOrderItem[];
}

export interface IReview {
  id: number;
  product_id: number;
  author_id: number;
  content: string;
  rating: number;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  is_active?: boolean; // Optional
}

export default {};
