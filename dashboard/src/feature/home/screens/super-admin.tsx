import { LineChart } from '@/components/lineChart';
import Box from '../components/box';
import Sell from '../components/sell';
import { useGetCategoryCountQuery, useGetLastMonthSellsQuery, useGetOrderCountQuery, useGetProductCountQuery, useGetSellCountQuery } from '../api';

export default function SuperAdmin() {
  const { data: totalCategory } = useGetCategoryCountQuery(undefined);
  const { data: totalProduct } = useGetProductCountQuery(undefined);
  const { data: totalOrder } = useGetOrderCountQuery(undefined);
  const { data: totalSell } = useGetSellCountQuery(undefined);
  const { data: lastMonthSells } = useGetLastMonthSellsQuery(undefined);

  return (
    <div>
      {/* Box  */}
      <div className="mb-3 grid sm:grid-cols-1  md:grid-cols-2 gap-4 xl:grid-cols-4">
        <Box title="Total Category" count={totalCategory || 0} />
        <Box title="Total product" count={totalProduct || 0} />
        <Box title="Total Order" count={totalOrder || 0} />
        <Box title="Total Sell" count={totalSell || 0} />
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <LineChart />
        <Sell count={lastMonthSells?.count || 0} sells={lastMonthSells?.sells || []} />
      </div>
    </div>
  );
}
