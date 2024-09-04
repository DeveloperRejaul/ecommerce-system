export default function Box() {
    return (
        <div className='border p-5 space-y-2'>
            <div className='flex justify-between'>
                <p className="font-bold"> Total Revenue </p>
                <p> $ </p>
            </div>
            <p className="text-2xl font-bold"> $45,231.89 </p>
            <p className="text-gray-500"> +20.1% from last month </p>
        </div>
    );
}
