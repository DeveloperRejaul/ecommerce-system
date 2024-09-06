import Lottie from 'lottie-react';
import animationData from '@/assets/lottie/animation.json';
import btnLoadingAnimation from '@/assets/lottie/loading.json';

export const Loading = () => {
  return (
    <div className='flex flex-1 justify-center items-center h-[100vh]'>
      <Lottie animationData={animationData} loop={true} className='h-[200px] w-[200px] lg:h-[400px] lg:w-[400px]' />
    </div>
  );
};

export const BtnLoading = () => {
  return <Lottie animationData={btnLoadingAnimation} loop={true} className='h-[25px] w-[25px]' />;
};


