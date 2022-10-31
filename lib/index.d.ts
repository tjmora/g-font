declare type FontStyleValueType = "normal" | "italic";
declare type FontWeightSematicValueType = "thin" | "extra light" | "light" | "regular" | "medium" | "semi-bold" | "bold" | "extra bold" | "black";
declare type FontWeightValueType = number | FontWeightSematicValueType;
declare type OtherThan<T extends FontStyleValueType | FontWeightValueType> = T extends FontStyleValueType ? FontWeightValueType : T extends FontWeightValueType ? FontStyleValueType : FontWeightValueType;
export declare function buildLink(): string;
export default function gFont<T extends FontStyleValueType | FontWeightValueType>(name: string, trail: string, styleParam1?: T, styleParam2?: OtherThan<T>): {
    css: string;
    obj: {
        fontFamily: string;
        fontStyle: string;
        fontWeight: string;
    };
};
export {};
