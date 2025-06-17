/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable react/require-default-props */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Pagination from './pagination';
import { alertDialog } from './Alert';
import { copyToClipboard } from '@/core/lib/utils';
import Copy from '@/assets/icon/Copy';
import Trash from '@/assets/icon/Trash';
import ChevronRight from '@/assets/icon/ChevronRight';
import SquarePen from '@/assets/icon/SquarePen';

interface ITableIndexProps {
    titles:{text: string; className?:string}[]
    caption?:string;
    data: object[]
    totalPage?: number;
    activePage?: number;
    handleNextPage?: () => void
    handlePrevuesPage?: () => void
    handlePageNumber?: (num: number) => void
    handleEdit?: (data: any) => void;
    handleDelete?: (data: any) => void;
    handleDetails?: (data: any) => void;
    clipboardEnable?: boolean
    cellStyle?: {
      key?: string;
      value?: string[] | string
      className?: string[] | string
    }
}
export default function TableIndex(props: ITableIndexProps) {
  const avatarList = Array.from({ length: 5 }, (_, i) => `avatar-${i + 1}`).concat(['avatar']);

  const { titles, caption, data, totalPage, activePage, handleNextPage, handlePageNumber, handlePrevuesPage, cellStyle, handleDelete, handleEdit, handleDetails, clipboardEnable = false } = props;

  const handleDeleteItem = (d: { [key: string]: any; }) => {
    alertDialog.show({ message: 'Delete Item' }, (value) => {
      if (value === 'continue') {
        handleDelete?.(d);
      }
    });
  };
  const handleEditItem = (d: { [key: string]: any; }) => {
    alertDialog.show({ message: 'Update Item' }, (value) => {
      if (value === 'continue') {
        handleEdit?.(d);
      }
    });
  };

  return (
    <div className="w-[75vw] overflow-auto md:w-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {titles.map((title) => <TableHead key={title.text} className={title.className}>{title.text}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((obj: {[key:string]: any}) => {
            const keys = Object.keys(obj);
            return (
              <TableRow key={Math.random() * 10}>
                {keys.map((key) => {
                  if (avatarList.includes(key.toLowerCase())) {
                    const index = cellStyle?.value?.indexOf('avatar');
                    let className = '';
                    if (cellStyle?.className?.length && typeof index !== 'undefined' && index >= 0) {
                      className = cellStyle?.className?.[index] || '';
                    }
                    return (
                      <TableCell key={key}>
                        <Avatar className={className}>
                          <AvatarImage src={obj[key]} alt="@shadcn" />
                          <AvatarFallback>{obj[key]?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                    );
                  }
                  if (key.toLowerCase() === 'action') {
                    return (
                      <TableCell key={Math.random() * 10} className="flex space-x-2 justify-end">
                        {clipboardEnable && (
                        <Copy
                          className="text-gray-400  cursor-pointer transition-all hover:text-blue-500"
                          size={28}
                          onClick={() => copyToClipboard(obj?.id)}
                        />
                        )}
                        {handleDelete && (
                        <Trash
                          className="text-gray-400  cursor-pointer transition-all hover:text-red-500"
                          size={28}
                          onClick={() => handleDeleteItem(obj)}
                        />
                        )}
                        {handleEdit && (
                        <SquarePen
                          className="text-gray-400  cursor-pointer transition-all hover:text-blue-400"
                          size={25}
                          onClick={() => handleEditItem(obj)}
                        />
                        )}
                        {handleDetails && (
                        <div className="bg-zinc-700 flex justify-center items-center px-1 rounded-[3px] cursor-pointer hover:bg-blue-400 transition duration-500" onClick={() => handleDetails?.(obj)}>
                          <ChevronRight />
                        </div>
                        )}
                      </TableCell>
                    );
                  }
                  // if not match with key we cant't display this item
                  if (titles.findIndex((value) => value.text.toLowerCase() === key.toLowerCase()) === -1) return null;

                  // apply key value specific styles
                  if (cellStyle && cellStyle.className && cellStyle.value && cellStyle.key && cellStyle.key === key && Array.isArray(cellStyle.value) && Array.isArray(cellStyle.className)) {
                    const valueIndex = cellStyle.value.indexOf(obj[key]);
                    return <TableCell className={cellStyle.className[valueIndex]} key={key}>{obj[key]}</TableCell>;
                  }

                  // apply specific styles
                  if (cellStyle?.key === key && typeof cellStyle?.className === 'string') {
                    return <TableCell className={cellStyle.className} key={key}>{obj[key]}</TableCell>;
                  }

                  // apply specific styles
                  if (typeof cellStyle?.value === 'string' && typeof cellStyle.className === 'string' && cellStyle?.value === obj[key]) {
                    return <TableCell className={cellStyle.className} key={key}>{obj[key]}</TableCell>;
                  }

                  // apply all cell
                  if (typeof cellStyle?.className === 'string' && cellStyle.key === undefined && cellStyle.value === undefined) {
                    return <TableCell className={cellStyle.className} key={key}>{obj[key]}</TableCell>;
                  }

                  return <TableCell key={key}>{obj[key]}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Pagination
        activePageNumber={activePage || 0}
        totalPage={totalPage || 0}
        handleNext={handleNextPage}
        handlePrevues={handlePrevuesPage}
        handlePageNumber={handlePageNumber}
      />
      {caption && <p className="py-3 text-muted-foreground text-center">{caption}</p>}
    </div>
  );
}
