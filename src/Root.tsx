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
            width={1080}
            height={1080}
            schema={audiogramSchema}
            defaultProps={{
                // audio settings
                audioOffsetInSeconds: 0,
                audioFileUrl: staticFile("audio.wav"),
                // podcast data
                coverImageUrl: staticFile("podcast-cover.jpeg"),
                titleText: "Ep 550 - Supper Club × Remotion React",
                titleColor: "rgba(186, 186, 186, 0.93)",
                // captions settings
                captions: null,
                captionsFileName: staticFile("captions.json"),
                onlyDisplayCurrentSentence: false,
                captionsTextColor: "rgba(255, 255, 255, 0.93)",
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
                        (slowDurationInSeconds - props.audioOffsetInSeconds) * FPS,
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
