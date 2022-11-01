declare type FontWeightSematicValueType = "thin" | "extra light" | "light" | "regular" | "medium" | "semi-bold" | "bold" | "extra bold" | "black";
declare type FontWeightValueType = number | FontWeightSematicValueType;
declare type FontStyleValueType = "normal" | "italic";
export declare function buildLink(): string;
export declare function collectFontOnlyIf(cond: boolean): void;
export default function gFont(name: string, fallback: string, weight?: FontWeightValueType, style?: FontStyleValueType): {
    css: string;
    obj: {
        fontFamily: string;
        fontStyle: string;
        fontWeight: string;
    };
};
export {};
