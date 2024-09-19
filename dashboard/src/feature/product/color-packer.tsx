import { ScrollArea } from "@/components/ui/scroll-area";
import { colorNames } from "@/core/constant/constant";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";


interface ColorsProps {
    onChange: (colors: string[]) => void;
    colors?: string[]
}

export default function ColorsPacker({ colors, onChange }: ColorsProps) {

    const [color, setColor] = useState<string[]>(colors || []);


    useEffect(() => {
        onChange(color);
    }, [color]);


    // this function is used for add color to state array
    const handleColor = (name: string) => {
        setColor(pre => {
            if (!pre.includes(name)) {
                return [...pre, name];
            }
            return pre;
        });
    };

    // this function is used fro remove color from state array
    const handleRemove = (name: string) => {
        setColor(pre => pre.filter(c => c !== name));
    };


    return <div className="space-y-2">
        <div>
            <p> Colors </p>
            <div className="border gap-2 p-2 flex flex-wrap min-h-16" style={{ marginTop: 4 }}>
                {color.map((name, index) => <div key={Math.random() * index} className="bg-muted p-1">
                    <div className="flex">
                        <p className="bg-muted">{name}</p>
                        <X className="cursor-pointer font-bold bg-black ml-1 " size={20} onClick={() => handleRemove(name)} />
                    </div>
                    <div style={{ background: name }} className="w-full h-4" />
                </div>)}
            </div>
        </div>

        {/* Add colors */}
        <ScrollArea>
            <div className="flex flex-wrap gap-4 h-72">
                {colorNames.map((name, i) => <div key={Math.random() * i} className="bg-muted p-1">
                    <div className="flex">
                        <p className="bg-muted">{name}</p>
                        <Plus className="cursor-pointer font-bold bg-black ml-1 " size={20} onClick={() => handleColor(name)} />
                    </div>
                    <div style={{ background: name }} className="w-full h-4" />
                </div>)}
            </div>
        </ScrollArea >
    </div >;
}