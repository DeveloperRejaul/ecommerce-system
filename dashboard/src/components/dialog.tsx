import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

export function DialogCom({ children, btnText }: { children: ReactNode, btnText: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {['product', 'ratting'].some((e) => btnText.includes(e)) || (
        <p className="border px-4 py-2 cursor-pointer rounded-md">
          Create
          {btnText.replace('/', ' ')}
        </p>
        )}
      </DialogTrigger>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}
