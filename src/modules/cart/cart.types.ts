export interface AddToCartDTO {
    productId: string;
    size: string;
    color: string;
    quantity: number;
}

export interface UpdateCartItemDTO {
    quantity: number;
}

export interface CartItemResponse {
    productId: string;
    productName: string;
    price: number;
    size: string;
    color: string;
    image: string;
    stock: number;
    quantity: number;
    itemTotal: number;
}

export interface CartResponse {
    message?: string;
    items : CartItemResponse[];
    totalItems: number;
    totalPrice: number;
}