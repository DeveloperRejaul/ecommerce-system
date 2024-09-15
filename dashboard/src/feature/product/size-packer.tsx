import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";


interface SizesProps {
    onRemove: (name: string) => void;
    onAdd: (name: string, num: number) => void;
}

interface SizesType {
    name: string;
    number: number;
}


export default function SizesPacker({ onAdd, onRemove }: SizesProps) {
    const [sizes, setSize] = useState<SizesType[]>([]);

    // this function is used for add Size to state array
    const handleSize = (name: string, number: number) => {
        setSize(prev => {
            if (prev.find(s => s.name === name)) {
                return prev;
            }
            onAdd(name, +number);
            return [...prev, { name, number: +number }];
        });
    };

    // this function is used fro remove Size from state array
    const handleRemove = (name: string) => {
        onRemove(name);
        setSize(pre => pre.filter(c => c.name !== name));
    };


    return <div className="space-y-2">
        <div>
            <p> Sizes </p>
            <div className="border gap-2 p-2 flex flex-wrap  min-h-16" style={{ marginTop: 4 }}>
                {sizes.map((d, index) => (
                    <div key={Math.random() * index} className="bg-muted p-1" style={{ borderRadius: 5 }}>
                        <div className="flex">
                            <p className="bg-muted">{d.name}</p>
                            <X className="cursor-pointer font-bold bg-black ml-1 " size={20} onClick={() => handleRemove(d.name)} />
                        </div>
                        <p className="text-gray-400 font-bold text-sm">{d.number}</p>
                    </div>
                ))}
            </div>
        </div>


        {/* Add Sizes */}
        <div className="flex flex-wrap gap-4">
            {["SM", "MD", "LG", "XL", "2XL", "3XL"].map((name, i) => <div key={Math.random() * i} className="bg-muted p-1">
                <PopUp name={name} handleSize={handleSize} />
            </div>)}
        </div>
    </div >;
}





interface PopUpProps {
    name: string
    handleSize: (name: string, num: number) => void;
}
function PopUp({ name, handleSize }: PopUpProps) {
    const [number, setNumber] = useState<number>();

    return <Popover>
        <PopoverTrigger asChild>
            <div className="flex">
                <p className="bg-muted">{name}</p>
                <Plus className="cursor-pointer font-bold bg-black ml-1 " size={20} />
            </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Size Number</h4>
                    <p className="text-sm text-muted-foreground">
                        Type Number of size
                    </p>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Size</Label>
                    <Input
                        onChange={e => setNumber(+e.target.value)}
                        type="number"
                        className="col-span-2 h-8"
                    />
                </div>
                <Button onClick={() => {
                    if (number) handleSize(name, number);
                }}>
                    OK
                </Button>
            </div>
        </PopoverContent>
    </Popover>;
}