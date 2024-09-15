import { ScrollArea } from "@/components/ui/scroll-area";
import { colorNames } from "@/constant/constant";
import { Plus, X } from "lucide-react";
import { useState } from "react";


interface ColorsProps {
    onRemove: (name: string) => void;
    onAdd: (name: string) => void;
}

export default function ColorsPacker({ onAdd, onRemove }: ColorsProps) {

    const [colors, setColor] = useState<string[]>([]);

    // this function is used for add color to state array
    const handleColor = (name: string) => {
        setColor(pre => {
            if (!pre.includes(name)) {
                onAdd(name);
                return [...pre, name];
            }
            return pre;
        });
    };

    // this function is used fro remove color from state array
    const handleRemove = (name: string) => {
        onRemove(name);
        setColor(pre => pre.filter(c => c !== name));
    };


    return <div className="space-y-2">
        <div>
            <p> Colors </p>
            <div className="border gap-2 p-2 flex flex-wrap min-h-16" style={{ marginTop: 4 }}>
                {colors.map((name, index) => <div key={Math.random() * index} className="bg-muted p-1">
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