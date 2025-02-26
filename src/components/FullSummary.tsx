import React, { useEffect, useState } from 'react';
import Image from 'next/image'; // Import Image component from Next.js

interface CartItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
}

const ProductSummary: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Fetch cart items from local storage
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      setCartItems(JSON.parse(storedItems));
    }
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * 0.2; // Assuming a 20% discount for simplicity
  const deliveryFee = 3000; // Example fixed delivery fee
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="w-full h-full p-2 rounded-lg overflow-hidden flex flex-col justify-start items-start gap-1">
      {cartItems.map((item) => (
        <React.Fragment key={item.id}>
          {/* Product Item */}
          <div className="w-full flex justify-start items-center gap-2.5">
            <div className="w-[74.38px] h-[77.98px] relative bg-[#F0EEED] rounded-md overflow-hidden">
              <Image
                className="absolute w-[74.38px] h-[77.98px] object-cover"
                src={item.imageUrl}
                alt={item.title}
                layout="fill"
              />
            </div>
            <div className="flex-1 h-[81.57px] flex justify-between items-center">
              <div className="h-full flex flex-col justify-center items-start gap-2.5">
                <div className="flex flex-col justify-center items-start gap-1">
                  <div className="text-black text-xl font-medium leading-[21.59px]">
                    {item.title}
                  </div>
                  <div className="text-[#212121] text-xs font-normal leading-[14.4px] tracking-wider">
                    {item.description}
                  </div>
                </div>
              </div>
              <div className="w-[134.96px] h-[74.38px] flex flex-col justify-between items-end">
                <div className="text-[#212121] text-lg font-medium line-through leading-[21.59px]">
                  <span className="line-through">N</span> {item.price.toLocaleString()}
                </div>
                <div className="text-[#212121] text-lg font-medium leading-[21.59px]">
                  <span className="line-through">N</span> {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-0 border border-gray-200"></div>
        </React.Fragment>
      ))}

      {/* Summary */}
      <div className="w-full h-full flex justify-between items-end">
        <div className="flex flex-col justify-start items-start gap-6">
          <div className="text-[#757575] text-lg font-medium">Sub total</div>
          <div className="w-[173px] text-[#757575] text-xl font-medium leading-7">
            Discount (-20%)
          </div>
          <div className="text-[#757575] text-lg font-medium">Shipping</div>
          <div className="text-[#212121] text-xl font-bold">Total</div>
        </div>
        <div className="flex flex-col justify-start items-end gap-6">
          <div className="w-[134px] h-[26px] text-right text-[#212121] text-xl font-medium leading-9">
            <span className="line-through">N</span> {subtotal.toLocaleString()}
          </div>
          <div className="w-full h-[21px] text-right text-[#FF3333] text-xl font-medium leading-7">
            <span>-</span><span className="line-through">N</span> {discount.toLocaleString()}
          </div>
          <div className="w-[134px] h-[23px] text-right text-[#212121] text-xl font-medium leading-8">
            <span className="line-through">N</span> {deliveryFee.toLocaleString()}
          </div>
          <div className="w-[144px] h-[29px] text-right text-[#212121] text-xl font-medium leading-9">
            <span className="line-through">N</span> {total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;
