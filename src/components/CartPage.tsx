'use client';
import React, { useState } from 'react';
import CartComponent from './Cart';
import OrderSummary from './Summary';
import EmptyCart from '../components/EmptyCart';
import { useCart } from '../app/context/CartContext';
import Loading from '../components/Loading'; // Import Loading component
import Notification from '../components/Notification'; // Import Notification component

const CartPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const [loading, setLoading] = useState(false); // State for loading
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null); // State for notification
  const cartItems = state.items;

  const handleRemoveItem = async (id: number) => {
    setLoading(true); // Show loading
    try {
      await new Promise<void>((resolve) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
        resolve();
      });
      setNotification({ type: 'success', message: 'Item removed from cart!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to remove item from cart.' });
    } finally {
      setLoading(false); // Hide loading
    }
  };

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    setLoading(true); // Show loading
    try {
      await new Promise<void>((resolve) => {
        dispatch({
          type: 'UPDATE_QUANTITY',
          payload: {
            id,
            quantity: newQuantity,
          },
        });
        resolve();
      });
      setNotification({ type: 'success', message: 'Quantity updated!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to update quantity.' });
    } finally {
      setLoading(false); // Hide loading
    }
  };
  
  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between mt-[80px]">
      {/* Cart and Order Summary Sections */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-2">
        {/* Cart Component */}
        <div>
          <CartComponent
            cartItems={cartItems}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </div>

        {/* Order Summary Component */}
        <div>
          <OrderSummary cartItems={cartItems} />
        </div>
      </div>

      {/* Show Loading and Notification Components */}
      {loading && <Loading />}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default CartPage;
