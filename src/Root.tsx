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
                titleText: "日本科学家诺贝尔奖数量亚洲第一，可能与哪些因素有关？",
                titleColor: "rgba(238, 163, 24, 1)",
                captions: null,
                audioQuestionFileUrl: staticFile("question.mp3"),
                questionInSeconds: 0,
                audioAnswerFileUrl: staticFile("answer.mp3"),
                captionsFileName: staticFile("answer.json"),
                answerInSeconds: 0,
                audioThanksFileUrl: staticFile("thanks.mp3"),
                thanksInSeconds: 0,
                onlyDisplayCurrentSentence: false,
                captionsTextColor: "rgba(0, 0, 0, 0.7)",
            }}
            // Determine the length of the video based on the duration of the audio file
            // 下面这个函数主要用于渲染前计算内容的参数
            calculateMetadata={async ({ props }) => {
                // 获取文字
                const captions = await getSubtitles(props.captionsFileName);
                // 获取音频的长度
                const { slowDurationInSeconds: questionInSeconds } = await parseMedia({
                    src: props.audioQuestionFileUrl,
                    acknowledgeRemotionLicense: true,
                    fields: {
                        slowDurationInSeconds: true,
                    },
                });

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
                        (answerInSeconds + questionInSeconds + 1) * FPS,
                    ),

                    props: {
                        ...props,
                        captions,
                        questionInSeconds,
                        answerInSeconds
                    },
                    fps: FPS,
                };
            }}
        />
    );
};
