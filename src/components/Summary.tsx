import React from 'react';
import { useRouter } from 'next/navigation';

interface OrderSummaryProps {
  cartItems: { price: number; quantity: number; }[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems }) => {
  const router = useRouter();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * 0.2; // Assuming a 20% discount for simplicity
  const deliveryFee = 3000; // Example fixed delivery fee
  const total = subtotal - discount + deliveryFee;

  const handleCheckout = () => {
    router.push('/shipping'); // Navigate to the shipping page
  };

  return (
    <div className="w-full h-full p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col gap-6 bg-white">
      {/* Header */}
      <div className="text-gray-900 text-2xl font-bold">Order Summary</div>

      {/* Summary Items */}
      <div className="w-full flex flex-col gap-4">
        {/* Subtotal */}
        <div className="w-full flex justify-between items-center">
          <div className="text-gray-600 text-lg font-medium">Subtotal</div>
          <div className="text-right text-gray-900 text-lg font-semibold">
            <span className="line-through">N</span> {subtotal.toLocaleString()}
          </div>
        </div>

        {/* Discount */}
        <div className="w-full flex justify-between items-center">
          <div className="text-gray-600 text-lg font-medium">Discount (-20%)</div>
          <div className="text-right text-red-500 text-lg font-semibold">
            <span>-</span><span className="line-through">N</span> {discount.toLocaleString()}
          </div>
        </div>

        {/* Delivery Fee */}
        <div className="w-full flex justify-between items-center">
          <div className="text-gray-600 text-lg font-medium">Delivery Fee</div>
          <div className="text-right text-gray-900 text-lg font-semibold">
            <span className="line-through">N</span> {deliveryFee.toLocaleString()}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-200"></div>

        {/* Total */}
        <div className="w-full flex justify-between items-center">
          <div className="text-black text-xl font-bold">Total</div>
          <div className="text-right text-gray-900 text-xl font-bold">
            <span className="line-through">N</span> {total.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleCheckout}
          className="w-full md:w-auto flex-1 h-12 px-6 py-2 bg-green-700 rounded-full text-center text-white text-lg font-bold hover:bg-green-800 transition duration-200"
        >
          Go to Checkout
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
