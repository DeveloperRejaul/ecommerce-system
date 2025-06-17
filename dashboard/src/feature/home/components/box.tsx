interface IBoxProps {
  title : string;
  count: string;
}

export default function Box(props: IBoxProps) {
  const { title, count } = props;

  return (
    <div className="border p-5 space-y-2">
      <p className="font-bold">{title}</p>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-gray-500"> +20.1% from last month </p>
    </div>
  );
}
