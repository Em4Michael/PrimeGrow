'use client';
import React from 'react';
import Image from 'next/image';
import { FaTrashAlt, FaMinus, FaPlus } from 'react-icons/fa';

interface CartItemProps {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  onRemove: () => void;
  onUpdateQuantity: (newQuantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ imageUrl, title, description, price, quantity, onRemove, onUpdateQuantity }) => (
  <div className="w-full flex justify-start items-start gap-2.5 flex-row sm:flex-row">
    <Image
      className="w-[74.38px] h-[77.98px] object-cover"
      src={imageUrl}
      alt={title}
      width={74.38}
      height={77.98}
    />

    <div className="flex flex-col sm:flex-row justify-between w-full sm:items-center">
      <div className="flex flex-col gap-4 w-full sm:w-auto">
        <div className="flex flex-col gap-1">
          <div className="text-black text-xl font-medium leading-tight">{title}</div>
          <div className="text-gray-800 text-sm font-normal">{description}</div>
        </div>
        <div>
          <span className="text-gray-800 text-xl font-medium line-through">N</span>
          <span className="text-gray-800 text-xl font-medium">{(price * quantity).toLocaleString()}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-4">
        <FaTrashAlt onClick={onRemove} className="w-4 h-4 text-red-500 cursor-pointer" />
        <div className="flex items-center justify-between px-3 py-2 bg-gray-200 rounded-full gap-2">
          <FaMinus
            className="w-2 h-2 text-black cursor-pointer"
            onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
          />
          <div className="text-black text-sm font-normal">{quantity}</div>
          <FaPlus
            className="w-2 h-2 text-black cursor-pointer"
            onClick={() => onUpdateQuantity(quantity + 1)}
          />
        </div>
      </div>
    </div>
  </div>
);

interface CartComponentProps {
  cartItems: { id: number; imageUrl: string; title: string; description: string; price: number; quantity: number; }[];
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
}

const CartComponent: React.FC<CartComponentProps> = ({ cartItems, onRemoveItem, onUpdateQuantity }) => {
  return (
    <div className="w-full h-full p-6 overflow-hidden flex flex-col gap-4">
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          imageUrl={item.imageUrl}
          title={item.title}
          description={item.description}
          price={item.price}
          quantity={item.quantity}
          onRemove={() => onRemoveItem(item.id)}
          onUpdateQuantity={(newQuantity) => onUpdateQuantity(item.id, newQuantity)}
        />
      ))}
    </div>
  );
};

export default CartComponent;
