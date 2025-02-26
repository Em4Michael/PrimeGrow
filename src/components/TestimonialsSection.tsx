import Image from 'next/image';

const Testimonials: React.FC = () => {
  return (
    <div className="relative w-full h-full px-4 sm:px-14 py-12 sm:py-24 bg-[#F8F9FF] flex flex-col justify-start items-center gap-10 mb-4">
      {/* Header Section */}
      <div className="w-full h-24 flex flex-col justify-start items-center gap-5">
        <h2 className="text-center text-[#212121] text-2xl sm:text-3xl font-bold leading-[36px] sm:leading-[44px] tracking-[0.18px]">
          Real Stories from Satisfied Customers
        </h2>
        <p className="text-center text-[#757575] text-lg sm:text-xl font-normal leading-7 sm:leading-8 tracking-[0.12px] mb-5">
          Real Stories from Satisfied Farmers and Buyers
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="w-full max-w-5xl flex flex-wrap justify-center items-start gap-5 sm:gap-7 mt-5">
        {/* Testimonial Card 1 */}
        <div className="flex-1 min-w-[280px] p-6 sm:p-10 bg-white shadow-lg rounded-xl border border-[#E5F4F2] flex flex-col justify-start items-center gap-6 sm:gap-7">
          <div className="flex flex-col justify-center items-center gap-4 h-72">
            <div className="flex flex-col justify-center items-center gap-4 h-32">
              <Image
                className="rounded-full"
                src="/assets/photo.svg"
                alt="Customer"
                width={56}
                height={56}
              />
              <div className="flex flex-col justify-start items-center gap-2">
                <h3 className="text-center text-[#111827] text-lg sm:text-xl font-medium leading-6 sm:leading-8 tracking-[0.12px]">
                  Emma K.
                </h3>
                <p className="text-center text-[#374151] text-sm font-normal leading-5">
                  Local Farmer
                </p>
              </div>
            </div>
            <p className="text-center text-[#757575] text-sm sm:text-lg font-normal leading-6 sm:leading-7 tracking-[0.09px]">
              Jorge has completely transformed our farming operations. The ease of ordering and the freshness of the tomatoes have made a world of difference for our business.
            </p>
          </div>
          {/* Star Rating */}
          <div className="flex justify-center items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#F8D57E]"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .587l3.668 7.429L23 9.587l-5.834 5.689 1.368 7.96L12 18.897l-7.534 4.339 1.368-7.96L0 9.587l7.332-1.571L12 .587z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Testimonial Card 2 */}
        <div className="flex-1 min-w-[280px] p-6 sm:p-10 bg-white shadow-lg rounded-xl border border-[#E5F4F2] flex flex-col justify-start items-center gap-6 sm:gap-7">
          <div className="flex flex-col justify-center items-center gap-4 h-72">
            <div className="flex flex-col justify-center items-center gap-4 h-32">
              <Image
                className="rounded-full"
                src="/assets/photo (1).svg"
                alt="Customer"
                width={56}
                height={56}
              />
              <div className="flex flex-col justify-start items-center gap-2">
                <h3 className="text-center text-[#111827] text-lg sm:text-xl font-medium leading-6 sm:leading-8 tracking-[0.12px]">
                  Michael L.
                </h3>
                <p className="text-center text-[#374151] text-sm font-normal leading-5">
                  Restaurant Owner
                </p>
              </div>
            </div>
            <p className="text-center text-[#757575] text-sm sm:text-lg font-normal leading-6 sm:leading-7 tracking-[0.09px]">
              The quality of tomatoes we receive from Jorge is unmatched. The entire process from order to delivery is seamless, and the customer support is top-notch.
            </p>
          </div>
          {/* Star Rating */}
          <div className="flex justify-center items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#F8D57E]"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .587l3.668 7.429L23 9.587l-5.834 5.689 1.368 7.96L12 18.897l-7.534 4.339 1.368-7.96L0 9.587l7.332-1.571L12 .587z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Testimonial Card 3 */}
        <div className="flex-1 min-w-[280px] p-6 sm:p-10 bg-white shadow-lg rounded-xl border border-[#E5F4F2] flex flex-col justify-start items-center gap-6 sm:gap-7">
          <div className="flex flex-col justify-center items-center gap-4 h-72">
            <div className="flex flex-col justify-center items-center gap-4 h-32">
              <Image
                className="rounded-full"
                src="/assets/photo (2).svg"
                alt="Customer"
                width={56}
                height={56}
              />
              <div className="flex flex-col justify-start items-center gap-2">
                <h3 className="text-center text-[#111827] text-lg sm:text-xl font-medium leading-6 sm:leading-8 tracking-[0.12px]">
                  Lauren M.
                </h3>
                <p className="text-center text-[#374151] text-sm font-normal leading-5">
                  Small Grocery Owner
                </p>
              </div>
            </div>
            <p className="text-center text-[#757575] text-sm sm:text-lg font-normal leading-6 sm:leading-7 tracking-[0.09px]">
              We’ve been ordering from Jorge for a few months now, and the consistency in quality and service has been excellent. The tomatoes always arrive fresh and on time.
            </p>
          </div>
          {/* Star Rating */}
          <div className="flex justify-center items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#F8D57E]"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .587l3.668 7.429L23 9.587l-5.834 5.689 1.368 7.96L12 18.897l-7.534 4.339 1.368-7.96L0 9.587l7.332-1.571L12 .587z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
