export default function gFont(name: string, trail: string, weight?: number, style?: "normal" | "italic"): {
    css: string;
    obj: {
        fontFamily: string;
        fontStyle: string;
        fontWeight: string;
    };
};
