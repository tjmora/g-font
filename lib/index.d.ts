declare type FontWeightSematicValueType = "thin" | "extra light" | "light" | "regular" | "medium" | "semi-bold" | "bold" | "extra bold" | "black";
declare type FontWeightValueType = number | FontWeightSematicValueType;
declare type FontStyleValueType = "normal" | "italic";
export default class GFont {
    private linkTagId;
    private collector;
    private isCollecting;
    private latestLock;
    constructor(cond: boolean);
    private insertLinkTag;
    private attemptProvideLink;
    private collectFont;
    buildLink(): string;
    font(name: string, fallback: string, weight?: FontWeightValueType, style?: FontStyleValueType): {
        css: string;
        obj: {
            fontFamily: string;
            fontStyle: string;
            fontWeight: string;
        };
    };
}
export {};
