import React from 'react';
import Input from './Input';  // Make sure to adjust the import path to where the Input component is located

const Payment = () => {
  return (
    <div className="w-full h-full relative bg-white">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl h-auto p-2 bg-[#F7FCF9] rounded-lg mx-auto">
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900">Payment Details</h2>
          <form>
            <div className="space-y-4">
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-500 mb-2">Name on card</label>
                <Input
                  type="text"
                  placeholder="John Smith"
                  className="p-4 bg-[#E2F0E2] rounded-lg text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-500 mb-2">Card number</label>
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="p-4 bg-[#E2F0E2] rounded-lg text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="flex items-end space-x-2">
                  <div>
                    <label className="block text-sm md:text-base font-medium text-gray-500 mb-2">Expiration (MM/YY)</label>
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="MM"
                        maxLength={2}
                        className="w-16 p-4 bg-[#E2F0E2] rounded-lg text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                      <span className="text-xl font-medium text-gray-900">/</span>
                      <Input
                        type="text"
                        placeholder="YY"
                        maxLength={2}
                        className="w-16 p-4 bg-[#E2F0E2] rounded-lg text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm md:text-base font-medium text-gray-500 mb-2">CVC</label>
                  <Input
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    className="w-24 p-4 bg-[#E2F0E2] rounded-lg text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
