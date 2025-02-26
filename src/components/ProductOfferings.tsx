'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/navigation';
import { useCart } from '../app/context/CartContext';
import Loading from './Loading'; // Import the Loading component
import Notification from './Notification'; // Import the Notification component

const ProductOfferings: React.FC = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();
  const { dispatch } = useCart(); // Use cart context

  const toggleFavorite = (index: number) => {
    if (favorites.includes(index)) {
      setFavorites(favorites.filter((favIndex) => favIndex !== index));
    } else {
      setFavorites([...favorites, index]);
    }
  };

  const handleImageClick = (id: string) => {
    router.push(`/product?productId=${id}`);
  };

  const addToCart = async (item: {
    id: number;
    imageUrl: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
  }) => {
    setLoading(true);
    try {
      dispatch({ type: 'ADD_TO_CART', payload: item });
      setNotification({ type: 'success', message: 'Added to cart!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to add to cart.' });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
    }
  };

  return (
    <section className='w-full min-h-screen bg-[#EFF3F0] py-2 px-4'>
      {loading && <Loading />} {/* Show loading indicator */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {[
          {
            id: '1',
            src: '/assets/image 41.png',
            alt: 'Roma Tomatoes',
            price: 23000,
            description: 'Roma Tomatoes',
          },
          {
            id: '2',
            src: '/assets/image 44.png',
            alt: 'Cherry Tomatoes',
            price: 23000,
            description: 'Cherry Tomatoes',
          },
          {
            id: '3',
            src: '/assets/image 45.png',
            alt: 'Cherry Tomatoes',
            price: 23000,
            description: 'Heirloom Tomatoes',
          },
        ].map((product, index) => (
          <div
            key={product.id}
            className='bg-white rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer'
            onClick={() => handleImageClick(product.id)}
          >
            <div className='relative w-full h-64'>
              <Image
                className='w-full h-full object-cover'
                src={product.src}
                alt={product.alt}
                layout='fill'
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(index);
                }}
                className={`absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer ${
                  favorites.includes(index) ? 'text-red-700' : 'text-gray-500'
                }`}
              >
                <FontAwesomeIcon
                  icon={favorites.includes(index) ? solidHeart : regularHeart}
                />
              </div>
            </div>
            <div className='p-4 flex flex-col flex-grow'>
              <div className='flex flex-col h-full justify-between'>
                <div className='flex justify-between items-center mb-4'>
                  <div className='text-gray-800 text-xl font-medium'>
                    {product.description}
                  </div>
                  <div className='text-center'>
                    <span className='text-gray-800 text-2xl font-bold'>N</span>
                    <span className='text-gray-800 text-3xl font-bold'>
                      {product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className='flex justify-center'>
                  <button
                    className='bg-[#257009] text-white font-bold w-full py-3 px-4 rounded-lg'
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: Number(product.id),
                        imageUrl: product.src,
                        title: product.description,
                        description: '2 KG Box',
                        price: product.price,
                        quantity: 1,
                      });
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductOfferings;
