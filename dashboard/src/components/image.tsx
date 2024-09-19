import { useState } from "react";


interface IIMageProps {
    src: string;
    alt: string;
    defaultSrc?: string,
    className?: string
}

export default function Image({ src, defaultSrc, alt, className }: IIMageProps) {
    const defaults = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaXwQvoIAFB4vAjEEqtGJXGMHga5Ax7AbpfA&s';
    const [imageSrc, setImageSrc] = useState(src);

    const handleError = () => {
        setImageSrc(defaultSrc || defaults);
    };

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
}