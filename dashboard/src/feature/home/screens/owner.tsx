import { useGetShopCountQuery } from '../api';
import Box from '../components/box';

export default function Owner() {
  const { data } = useGetShopCountQuery(undefined);
  return (
    <div className="mb-3 grid sm:grid-cols-1  md:grid-cols-2 gap-4 xl:grid-cols-4">
      <Box title="Total Shop" count={data || '0'} />
    </div>
  );
}
