// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
import React, { createRef, RefObject, useEffect, useImperativeHandle, useState } from 'react';
import { Input } from '@/components/ui/input';
import { urlToFile } from '@/core/lib/file';
import X from '@/assets/icon/X';
import Plus from '@/assets/icon/Plus';

export type ImgPackerRef = {reset: () => void};

interface ImgPackerProps {
    onChange: (file: File[]) => void;
    images?: string[],
    ref?: RefObject<ImgPackerRef>
}

export default function ImgPacker({ images, onChange, ref }: ImgPackerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = createRef<HTMLInputElement>();

  useImperativeHandle(ref, () => ({ reset: () => setFiles([]) }));

  useEffect(() => {
    (async () => {
      if (images) {
        const imageFiles = await Promise.all(images.map((url: string) => urlToFile(url)));
        setFiles(imageFiles);
      }
    })();
  }, []);

  useEffect(() => {
    onChange?.(files);
  }, [files]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFiles((pre) => [...pre, file]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleRemove = (src: File) => {
    setFiles((pre) => pre.filter((fl) => fl !== src));
  };

  return (
    <div className="flex flex-wrap gap-3">
      {files.map((src) => <ImgView key={src.name} src={URL.createObjectURL(src)} handleRemove={() => handleRemove(src)} />)}
      {files.length < 5 && (
      <div
        className="border border-dotted w-[10rem] h-[10rem] flex justify-center items-center overflow-hidden"
      >
        <Plus className="cursor-pointer font-bold ml-1 text-gray-400" size="3rem" onClick={handleClick} />
        <Input
          id="picture"
          type="file"
          style={{ display: 'none', height: '100%', width: '100%' }}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      )}
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
