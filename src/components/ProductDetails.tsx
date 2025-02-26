'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../app/context/CartContext';
import Loading from '../components/Loading'; // Import Loading component
import Notification from '../components/Notification'; // Import Notification component

const products = [
  { id: 1, src: '/assets/image 41.png', alt: 'Roma Tomatoes', price: 5.50, currency: 'N', description: 'Roma Tomatoes' },
  { id: 2, src: '/assets/image 44.png', alt: 'Heirloom Tomatoes', price: 5.50, currency: '$', description: 'Cherry Tomatoes' },
  { id: 3, src: '/assets/image 45.png', alt: 'Cherry Tomatoes', price: 5.50, currency: '$', description: 'Cherry Tomatoes' },
];

const ProductDetails: React.FC = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false); // State for loading
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null); // State for notification
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dispatch } = useCart(); // Use cart context

  const productId = searchParams ? parseInt(searchParams.get('productId') || '') : null;
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return <div>Product not found</div>;
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Update handleAddToCart to handle loading and notifications
  const handleAddToCart = async (): Promise<void> => {
    setLoading(true); // Show loading
    try {
      await new Promise<void>((resolve) => {
        dispatch({
          type: 'ADD_TO_CART',
          payload: {
            id: product.id,
            imageUrl: product.src,
            title: product.description,
            description: '2 KG Box',
            price: product.price,
            quantity,
          },
        });
        resolve();
      });
      setNotification({ type: 'success', message: 'Product added to cart!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to add product to cart.' });
    } finally {
      setLoading(false); // Hide loading
    }
  };

  // Update handleCheckout to wait for handleAddToCart to complete
  const handleCheckout = async () => {
    await handleAddToCart(); // Wait for product to be added to cart
    router.push('/cart'); // Navigate to the cart page
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  return (
    <div className='w-full h-full flex flex-col md:flex-row gap-8 md:gap-16'>
      {/* Product Image Section */}
      <div className='w-full md:w-[504px] h-[465px] flex flex-col justify-center items-start gap-4.5'>
        <div className='w-full md:w-[504px] h-[455px] relative bg-white rounded-t-lg overflow-hidden'>
          <Image
            className="w-full md:w-[504px] h-[410px] absolute top-[19px] left-0 shadow-md rounded-t-lg"
            src={product.src}
            alt={product.alt}
            width={450}
            height={450}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            className={`absolute top-8 left-4 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer ${
              isFavorite ? 'text-red-700' : 'text-gray-500'
            }`}
          >
            <FontAwesomeIcon
              icon={isFavorite ? solidHeart : regularHeart}
            />
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className='flex-1 flex flex-col justify-center items-start gap-6'>
        <div className='h-auto md:h-[248px] flex flex-col justify-start items-start gap-4'>
          <div className='h-auto md:h-[150px] flex flex-col justify-start items-start gap-4'>
            <div className='flex items-start'>
              <h1 className='text-[#212121] text-2xl font-medium leading-10'>
                {product.description}
              </h1>
            </div>
            <div className='h-auto md:h-[94px] flex flex-col justify-center items-start gap-1'>
              <div className='p-2 bg-[#CFF7D3] rounded-md'>
                <p className='text-[#20AD2D] text-sm font-medium leading-normal'>
                  In Stock
                </p>
              </div>
            </div>
            <div className='flex flex-col justify-center items-start gap-4'>
              <h2 className='text-[#212121] text-xl font-semibold leading-tight'>
                {product.currency}{product.price} <span className='text-base font-normal'>/ kg</span>
              </h2>
            </div>
          </div>

          {/* Quantity Counter and Add to Cart Button */}
          <div className='flex items-center gap-4'>
            <div className="flex items-center justify-between px-3 py-2 bg-gray-200 rounded-full gap-2">
              <FaMinus
                className="w-4 h-4 text-black cursor-pointer"
                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
              />
              <div className="text-black text-sm font-normal">{quantity}</div>
              <FaPlus
                className="w-4 h-4 text-black cursor-pointer"
                onClick={() => handleQuantityChange(quantity + 1)}
              />
            </div>
            <button
              onClick={handleAddToCart}
              className='px-4 py-2 bg-[#257009] rounded-md text-white'>
              Add to Cart
            </button>
          </div>

          {/* Checkout Button */}
          <div
            onClick={handleCheckout}
            className='w-[90vw] md:w-[640px] h-[48px] p-3 bg-[#257009] rounded-md border border-[#2C2C2C] flex items-center justify-center gap-2 cursor-pointer'>
            <span className='text-[#F5F5F5] text-lg font-normal leading-7'>
              Checkout
            </span>
          </div>
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

export default ProductDetails;
