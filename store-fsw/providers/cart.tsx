"use client";

import { ProductWithTotalPrice } from "@/helpers/product";
import { createContext, useMemo, useState } from "react";

export interface CartProduct extends ProductWithTotalPrice {
   quantity: number;
}

interface ICartContext {
   products: CartProduct[];
   cartTotalPrice: number;
   cartBasePrice: number;
   cartTotalDiscount: number;
   total: number;
   subtotal: number;
   totalDiscount: number;
   addProductToCart: (product: CartProduct) => void;
   decreaseProductQuantify: (productId: string) => void;
   increaseProductQuantify: (productId: string) => void;
   removeProductFromCart: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
   products: [],
   cartTotalPrice: 0,
   cartBasePrice: 0,
   cartTotalDiscount: 0,
   total: 0,
   subtotal: 0,
   totalDiscount: 0,
   addProductToCart: () => { },
   decreaseProductQuantify: () => { },
   increaseProductQuantify: () => { },
   removeProductFromCart: () => { },
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
   const [products, setProducts] = useState<CartProduct[]>([]);

   const subtotal = useMemo(() => {
      return products.reduce((acc, product) => {
         // return acc + Number(product.basePrice);
         return acc + Number(product.basePrice) * product.quantity;
      }, 0);
   }, [products]);

   const total = useMemo(() => {
      return products.reduce((acc, product) => {
         // return acc + Number(product.totalPrice);
         return acc + Number(product.totalPrice * product.quantity);
      }, 0);
   }, [products]);

   const totalDiscount = subtotal - total;

   const addProductToCart = (product: CartProduct) => {
      const productIsAlreadyOnCart = products.some(
         (cartProduct) => cartProduct.id === product.id,
      );

      if (productIsAlreadyOnCart) {
         setProducts((prev) =>
            prev.map((cartProduct) => {
               if (cartProduct.id === product.id) {
                  return {
                     ...cartProduct,
                     quantity: cartProduct.quantity + product.quantity,
                  };
               }

               return cartProduct;
            }),
         );
      }

      setProducts((prev) => [...prev, product]);
   };

   const decreaseProductQuantify = (productId: string) => {
      setProducts((prev) =>
         prev
            .map((cartProduct) => {
               if (cartProduct.id === productId) {
                  return {
                     ...cartProduct,
                     quantity: cartProduct.quantity - 1,
                  };
               }

               return cartProduct;
            })
            .filter((cartProduct) => cartProduct.quantity > 0),
      );
   };

   const increaseProductQuantify = (productId: string) => {
      setProducts((prev) =>
         prev.map((cartProduct) => {
            if (cartProduct.id === productId) {
               return {
                  ...cartProduct,
                  quantity: cartProduct.quantity + 1,
               };
            }

            return cartProduct;
         }),
      );
   };

   const removeProductFromCart = (productId: string) => {
      setProducts((prev) =>
         prev.filter((cartProduct) => cartProduct.id !== productId),
      );
   };

   return (
      <CartContext.Provider
         value={{
            products,
            addProductToCart,
            decreaseProductQuantify,
            increaseProductQuantify,
            removeProductFromCart,
            subtotal,
            total,
            totalDiscount,
            cartTotalPrice: 0,
            cartBasePrice: 0,
            cartTotalDiscount: 0,
         }}
      >
         {children}
      </CartContext.Provider>
   );
};

export default CartProvider;