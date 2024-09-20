
interface IPagination {
    totalPage: number
    handlePrevues: () => void
    handleNext: () => void
    activePageNumber: number
}

export default function Pagination({ totalPage, handleNext, handlePrevues, activePageNumber }: IPagination) {
    return (
        <div className='py-4 flex justify-between px-10 bg-muted' >
            <p>Total page : {totalPage}</p>
            <div className='flex gap-x-4'>
                <p className="hover:text-yellow-700 cursor-pointer" onClick={handlePrevues}>Prevues</p>
                <p className="px-3 py-1 bg-yellow-700 hover:bg-yellow-700 cursor-pointer ">{activePageNumber}</p>
                {activePageNumber >= totalPage ?
                    <p className="px-3 py-1" /> :
                    <p className="px-3 py-1 hover:bg-yellow-700 cursor-pointer">{activePageNumber + 1}</p>
                }
                <p className={`hover:text-yellow-700 cursor-pointer ${activePageNumber >= totalPage && "pointer-events-none"}`}
                    onClick={handleNext}>
                    Next
                </p>
            </div>
        </div>
    );
}
