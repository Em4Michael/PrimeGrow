'use client';

import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import Loading from './Loading'; // Loading component
import Notification from './Notification'; // Notification component
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to access tokens

const ProductivityForm: React.FC = () => {
  // Form states
/*   const [plantTag, setPlantTag] = useState(''); */
  const [red, setRed] = useState('');
  const [yellow, setYellow] = useState('');
  const [green, setGreen] = useState('');
  const [flower, setFlower] = useState('');
  const [estimatedPlants, setEstimatedPlants] = useState('');
  const [estimatedAffectedStem, setEstimatedAffectedStem] = useState('');
  const [description, setDescription] = useState('');

  // Notification and loading states
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Helper function to validate numeric inputs
  const isNumeric = (value: string) => /^\d+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (
     /*  !plantTag || */
      !red ||
      !yellow ||
      !green ||
      !flower ||
      !estimatedPlants ||
      !estimatedAffectedStem ||
      !description
    ) {
      setNotification({ type: 'error', message: 'All fields are required.' });
      return;
    }

    if (
      !isNumeric(red) ||
      !isNumeric(yellow) ||
      !isNumeric(green) ||
      !isNumeric(flower) ||
      !isNumeric(estimatedPlants) ||
      !isNumeric(estimatedAffectedStem)
    ) {
      setNotification({ type: 'error', message: 'Please enter valid numeric values.' });
      return;
    }

    setIsLoading(true);
    try {
      // Retrieve the token from cookies
      const token = Cookies.get('token');

      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Prepare the payload
      const payload = {
    /*     plantTag, */
        red: Number(red),
        yellow: Number(yellow),
        green: Number(green),
        flower: Number(flower),
        estimatedPlants: Number(estimatedPlants),
        estimatedAffectedStem: Number(estimatedAffectedStem),
        description,
      };

      // Send POST request to the protected API endpoint with Authorization header
      const response = await axios.post(
        'http://localhost:5000/api/plant-report/productivity',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setNotification({ type: 'success', message: 'Productivity report updated successfully!' });
        // Optionally, clear the form
       /*  setPlantTag(''); */
        setRed('');
        setYellow('');
        setGreen('');
        setFlower('');
        setEstimatedPlants('');
        setEstimatedAffectedStem('');
        setDescription('');
      } else {
        setNotification({ type: 'error', message: 'Failed to update productivity report.' });
      }
    } catch (error: any) {
      console.error('Error updating productivity report:', error);
      // Extract error message from response if available
      const errorMsg = error.response?.data?.message || 'An error occurred. Please try again.';
      setNotification({ type: 'error', message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full relative bg-white">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl h-auto p-6 bg-[#F7FCF9] rounded-lg mx-auto shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900">Update Plant’s Productivity</h2>

          {/* Plant Tag */}
          {/* <div className="space-y-2">
            <label htmlFor="plantTag" className="text-sm md:text-base font-medium text-gray-500">
              Plant Tag
            </label>
            <Input
              id="plantTag"
              name="plantTag"
              value={plantTag}
              onChange={(e) => setPlantTag(e.target.value)}
              placeholder="e.g 1A"
              className="bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900"
            />
          </div> */}

          {/* Red, Green, Yellow, Flowers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="red" className="text-sm md:text-base font-medium text-gray-500">
                Red
              </label>
              <Input
                id="red"
                name="red"
                value={red}
                onChange={(e) => setRed(e.target.value)}
                placeholder="Red"
                type="number"
               
                className="w-full bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="green" className="text-sm md:text-base font-medium text-gray-500">
                Green
              </label>
              <Input
                id="green"
                name="green"
                value={green}
                onChange={(e) => setGreen(e.target.value)}
                placeholder="Green"
                type="number"
               
                className="w-full bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="yellow" className="text-sm md:text-base font-medium text-gray-500">
                Yellow
              </label>
              <Input
                id="yellow"
                name="yellow"
                value={yellow}
                onChange={(e) => setYellow(e.target.value)}
                placeholder="Yellow"
                type="number"
               
                className="w-full bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="flower" className="text-sm md:text-base font-medium text-gray-500">
                Flowers
              </label>
              <Input
                id="flower"
                name="flower"
                value={flower}
                onChange={(e) => setFlower(e.target.value)}
                placeholder="Flowers"
                type="number"
               
                className="w-full bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900"
              />
            </div>
          </div>

          {/* Estimated Plants */}
          <div className="space-y-2">
            <label htmlFor="estimatedPlants" className="text-sm md:text-base font-medium text-gray-500">
              Estimated Plants
            </label>
            <Input
              id="estimatedPlants"
              name="estimatedPlants"
              value={estimatedPlants}
              onChange={(e) => setEstimatedPlants(e.target.value)}
              placeholder="0"
              type="number"
             
              className="bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900"
            />
          </div>

          {/* Estimated Affected Stems */}
          <div className="space-y-2">
            <label htmlFor="estimatedAffectedStem" className="text-sm md:text-base font-medium text-gray-500">
              Estimated Affected Stems
            </label>
            <Input
              id="estimatedAffectedStem"
              name="estimatedAffectedStem"
              value={estimatedAffectedStem}
              onChange={(e) => setEstimatedAffectedStem(e.target.value)}
              placeholder="Value"
              type="number"
             
              className="bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm md:text-base font-medium text-gray-500">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description here..."
              className="w-full h-28 bg-[#E2F0E2] rounded-lg p-4 text-base font-medium text-gray-900 resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 bg-[#336C36] text-white text-base font-semibold rounded-full hover:bg-[#28512B] transition-colors duration-300"
          >
            Update Productivity
          </Button>
        </form>
      </div>

      {/* Loading Spinner */}
      {isLoading && <Loading />}

      {/* Notification */}
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

export default ProductivityForm;
