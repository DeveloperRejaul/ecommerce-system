import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "./ui/alert-dialog";

interface IAlertDialogProps {
    isOpen?: boolean;
    handleActin: (type: "cancel" | 'continue') => void;
    message: string;
}

export default function Alert({ isOpen, handleActin, message }: IAlertDialogProps) {
    return <AlertDialog open={isOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    {message}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => handleActin("cancel")}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleActin('continue')}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>;
}
