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
                // audio settings
                audioOffsetInSeconds: 0,
                // audioFileUrl: staticFile("audio.wav"),
                // podcast data
                titleText: "日本科学家诺贝尔奖数量亚洲第一，可能与哪些因素有关？",
                titleColor: "rgba(238, 163, 24, 1)",
                // captions settings
                captions: null,
                // captionsFileName: staticFile("captions.json"),
                audioFileUrl: staticFile("1.mp3"),

                captionsFileName: staticFile("2.json"),
                onlyDisplayCurrentSentence: false,
                captionsTextColor: "rgba(0, 0, 0, 0.7)",
            }}
            // Determine the length of the video based on the duration of the audio file
            // 下面这个函数主要用于渲染前计算内容的参数
            calculateMetadata={async ({ props }) => {
                // 获取文字
                const captions = await getSubtitles(props.captionsFileName);
                // 获取音频的长度
                const { slowDurationInSeconds } = await parseMedia({
                    src: props.audioFileUrl,
                    acknowledgeRemotionLicense: true,
                    fields: {
                        slowDurationInSeconds: true,
                    },
                });

                
                // 返回视频的长度和一些参数
                return {
                    durationInFrames: Math.floor(
                        (slowDurationInSeconds + 1 - props.audioOffsetInSeconds) * FPS,
                    ),
                    props: {
                        ...props,
                        captions,
                    },
                    fps: FPS,
                };
            }}
        />
    );
};
