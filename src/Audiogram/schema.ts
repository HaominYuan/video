import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { Caption } from "@remotion/captions";


export const audiogramSchema = z.object({
    // podcast data
    coverImageUrl: z.string(),
    titleText: z.string(),
    titleColor: zColor(),
    // captions settings
    captionsFileName: z
        .string()
        .refine((s) => s.endsWith(".srt") || s.endsWith(".json"), {
            message: "Subtitles file must be a .srt or .json file",
        }),
    captionsTextColor: zColor(),
    onlyDisplayCurrentSentence: z.boolean(),
    // audio settings
    audioFileUrl: z.string(),
    audioOffsetInSeconds: z.number().min(0),
});

export type AudiogramCompositionSchemaType = z.infer<typeof audiogramSchema> & {
    captions: Caption[] | null;
};
