import { LineChart } from '@/components/lineChart';
import Box from './box';
import Sell from './sell';

export default function Home() {
  return (
    <div>

      {/* Box  */}
      <div className='mb-3 grid grid-cols-2 gap-4 xl:grid-cols-4'>
        <Box />
        <Box />
        <Box />
        <Box />
      </div>

      {/* Chart */}
      <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
        <LineChart />
        <Sell />
      </div>
    </div>
  );
}
