import { Input } from "@/components/ui/input";
import { urlToFile } from "@/core/lib/file";
import { Plus, X } from "lucide-react";
import { createRef, useEffect, useState } from "react";

interface ImgPackerProps {
    onChange: (file: File[]) => void;
    images?: string[],
}

export default function ImgPacker({ images, onChange }: ImgPackerProps) {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = createRef<HTMLInputElement>();


    useEffect(() => {
        (async () => {
            if (images) {
                const imageFiles = await Promise.all(images.map((url: string) => urlToFile(url)));
                setFiles(imageFiles);
            }
        })();
    }, []);


    useEffect(() => {
        onChange(files);
    }, [files]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setFiles(pre => [...pre, file]);
        };
    };

    const handleClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleRemove = (src: File) => {
        setFiles(pre => pre.filter(fl => fl !== src));
    };

    return (
        <div className="flex flex-wrap gap-3">
            {files.map((src, i) => <ImgView key={i} src={URL.createObjectURL(src)} handleRemove={() => handleRemove(src)} />)}
            {files.length < 5 && <div
                className="border border-dotted w-[10rem] h-[10rem] flex justify-center items-center overflow-hidden">
                <Plus className="cursor-pointer font-bold ml-1 text-gray-400" size='3rem' onClick={handleClick} />
                <Input
                    id="picture"
                    type="file"
                    style={{ display: "none", height: "100%", width: "100%" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept='image/*'
                />
            </div>}
        </div>
    );
}

function ImgView({ src, handleRemove }: { src: string, handleRemove: () => void }) {
    return (
        <div className="border border-dotted w-[10rem] h-[10rem] flex justify-center items-center overflow-hidden relative">
            <X className="cursor-pointer font-bold bg-black ml-1 absolute right-1 top-1" size={20} onClick={handleRemove} />
            <img src={src} alt="PING" />
        </div>
    );
}
