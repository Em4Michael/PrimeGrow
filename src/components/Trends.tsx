import React from 'react';

const LatestTrend: React.FC = () => {
  return (
    <div className="w-full h-full p-16 bg-white flex flex-col justify-start items-center gap-6">
      {/* Header Section */}
      <div className="flex flex-col justify-start items-center gap-2">
        <div className="w-full text-center text-[#1E1E1E] text-2xl md:text-4xl font-medium leading-10 tracking-[0.16px]">
          Follow the latest trends
        </div>
        <div className="w-full text-center text-[#757575] text-xl md:text-2xl font-normal leading-8 tracking-[0.12px]">
          With our daily newsletter
        </div>
      </div>

      {/* Email Input Section */}
      <div className="flex justify-start items-end gap-3">
        <div className="h-[52px] px-4 py-3 bg-white rounded-md border border-[#D9D9D9] flex items-center">
          <div className="flex-1 text-[#B3B3B3] text-lg font-normal leading-7 tracking-[0.09px]">
            you@example.com
          </div>
        </div>
        <div className="w-[88px] p-3 bg-[#257009] rounded-md flex justify-center items-center gap-2 cursor-pointer">
          <div className="text-[#F5F5F5] text-lg font-bold leading-7 tracking-[0.09px]">
            Submit
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestTrend;
