import { useEffect, useState } from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from './ui/alert-dialog';

export const alertDialog:{
  show: ({ message }: {
      message: string;
      title?: string;
  }, cb: (value: 'cancel' | 'continue') => void) => void;
  hide: () => void;
} = {
  show: () => {},
  hide: () => {},
};

let callback:(value: 'cancel' | 'continue') => void = () => {};
export default function AlertContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [titleText, setTitleText] = useState<string | null>(null);
  useEffect(() => {
    alertDialog.hide = function () {
      setIsOpen(false);
    };

    alertDialog.show = function ({ message, title }:{message:string, title?:string}, cb: (value:'cancel' | 'continue')=> void) {
      setMessageText(message);
      if (title) setTitleText(title);
      setIsOpen(true);
      callback = cb;
    };
  }, []);
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titleText || 'Are you absolutely sure?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {messageText}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            callback('cancel');
            setIsOpen(false);
          }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            // handleActin('continue')
            callback('continue');
            setIsOpen(false);
          }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
