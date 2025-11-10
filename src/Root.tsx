import { Composition, staticFile } from "remotion";
import { Audiogram } from "./Audiogram/Main";
import { audiogramSchema } from "./Audiogram/schema";
import { getSubtitles } from "./helpers/fetch-captions";
import { FPS } from "./helpers/ms-to-frame";
import { parseMedia } from "@remotion/media-parser";

export const RemotionRoot: React.FC = () => {
    return (
        <Composition
            id="Audiogram"
            component={Audiogram}
            width={1920}
            height={1080}
            schema={audiogramSchema}
            defaultProps={{
                titleText: "title",
                titleColor: "rgba(238, 163, 24, 1)",
                captions: null,
                audioQuestionFileUrl: staticFile("question.mp3"),
                questionCaptionsFileName: staticFile("question.json"),
                questionInSeconds: 0,
                audioAnswerFileUrl: staticFile("answer.mp3"),
                answerCaptionsFileName: staticFile("answer.json"),
                answerInSeconds: 0,
                audioThanksFileUrl: staticFile("thanks.mp3"),
                thanksInSeconds: 0,
                onlyDisplayCurrentSentence: false,
                captionsTextColor: "rgba(0, 0, 0, 0.7)",
            }}
            // Determine the length of the video based on the duration of the audio file
            // 下面这个函数主要用于渲染前计算内容的参数
            calculateMetadata={async ({ props }) => {
                // 获取问题的字幕
                const questionCaptions = await getSubtitles(props.questionCaptionsFileName);

                // 将问题的字幕合并到props中
                const question = questionCaptions.reduce((acc, curr) => {
                    return acc + curr.text
                }, "");

                // 获取回答的字幕
                const answerCaptions = await getSubtitles(props.answerCaptionsFileName);
                // 获取问题音频的长度
                const { slowDurationInSeconds: questionInSeconds } = await parseMedia({
                    src: props.audioQuestionFileUrl,
                    acknowledgeRemotionLicense: true,
                    fields: {
                        slowDurationInSeconds: true,
                    },
                });

                // 获取回答音频的长度
                const { slowDurationInSeconds: answerInSeconds } = await parseMedia({
                    src: props.audioAnswerFileUrl,
                    acknowledgeRemotionLicense: true,
                    fields: {
                        slowDurationInSeconds: true,
                    },
                });


                // 返回视频的长度和一些参数
                return {
                    durationInFrames: Math.floor(
                        (answerInSeconds + questionInSeconds + 3) * FPS,
                    ),

                    props: {
                        ...props,
                        captions: answerCaptions,
                        questionInSeconds,
                        answerInSeconds,
                        titleText: question
                    },
                    fps: FPS,
                };
            }}
        />
    );
};
