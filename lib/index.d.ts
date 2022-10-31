declare type FontStyleValueType = "normal" | "italic";
declare type FontWeightValueType = "thin" | "extra light" | "light" | "regular" | "medium" | "semi-bold" | "bold" | "extra bold" | "black";
export declare function buildLink(): string;
export default function gFont(name: string, trail: string, styleParam1?: FontStyleValueType | FontWeightValueType | number, styleParam2?: FontStyleValueType | FontWeightValueType | number): {
    css: string;
    obj: {
        fontFamily: string;
        fontStyle: string;
        fontWeight: string;
    };
};
export {};
