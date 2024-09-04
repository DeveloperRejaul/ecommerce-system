import Lottie from 'lottie-react';
import animationData from '@/assets/lottie/animation.json';

export const Loading = () => {
  return (
    <div className='flex flex-1 justify-center items-center h-[100vh]'>
      <Lottie animationData={animationData} loop={true} className='h-[200px] w-[200px] lg:h-[400px] lg:w-[400px]'/>
    </div>
  );
};


