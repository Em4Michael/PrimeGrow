'use client';
import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';

interface CartItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: any): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      let updatedItems;

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...state.items, action.payload];
      }

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return { items: updatedItems };
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return { items: updatedItems };
    }
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload.id);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return { items: updatedItems };
    }
    case 'LOAD_CART': {
      return { items: action.payload };
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    // Load cart items from localStorage
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(storedCartItems) });
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
