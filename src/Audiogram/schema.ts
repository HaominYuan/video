import { z } from "zod";
import { Caption } from "@remotion/captions";


export const audiogramSchema = z.object({
    questionText: z.string(),
    answerText: z.string(),
});

export type AudiogramCompositionSchemaType = z.infer<typeof audiogramSchema> & {
    answerCaptions: Caption[] | undefined;
    audioQuestionFileUrl: string | undefined,
    audioAnswerFileUrl: string | undefined,
    audioThanksFileUrl: string | undefined,
    onlyDisplayCurrentSentence: boolean,
    questionInSeconds: number,
    answerInSeconds: number,
    thanksInSeconds: number,
};
