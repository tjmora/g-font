export default function gFont(name: string, trail: string, style?: "normal" | "italic", weight?: number): {
    css: string;
    obj: {
        fontFamily: string;
        fontStyle: string;
        fontWeight: string;
    };
};
