import { IconTypes } from './icon.types';

export default function Check({ size, ...props }: IconTypes) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width={size || '24'} height={size || '24'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg>
  );
}
