import { Composition, staticFile } from "remotion";
import { Audiogram } from "./Audiogram/Main";
import { audiogramSchema } from "./Audiogram/schema";
import { FPS } from "./helpers/ms-to-frame";
import { parseMedia } from "@remotion/media-parser";
import { getAudioPathAndCaptions } from "./helpers/word-to-audio";

const calculateMetadata = async ({ props }) => {
    // 获取问题的音频和字幕
    const {
        audioFilePath: audioQuestionFileUrl,
        captions: questionCaptions,
    } = await getAudioPathAndCaptions(props.questionText);

    const {
        audioFilePath: audioAnswerFileUrl,
        captions: answerCaptions,
    } = await getAudioPathAndCaptions(props.answerText);

    // 获取问题音频的长度
    const { slowDurationInSeconds: questionInSeconds } =
        await parseMedia({
            src: audioQuestionFileUrl,
            acknowledgeRemotionLicense: true,
            fields: {
                slowDurationInSeconds: true,
            },
        });

    // 获取回答音频的长度
    const { slowDurationInSeconds: answerInSeconds } =
        await parseMedia({
            src: audioAnswerFileUrl,
            acknowledgeRemotionLicense: true,
            fields: {
                slowDurationInSeconds: true,
            },
        });

    const { slowDurationInSeconds: thanksInSeconds } = await parseMedia({
        src: staticFile("thanks.mp3"),
        acknowledgeRemotionLicense: true,
        fields: {
            slowDurationInSeconds: true,
        },
    });


    // 返回视频的长度和一些参数
    return {
        durationInFrames: Math.ceil(
            (answerInSeconds + questionInSeconds + thanksInSeconds + 10) * FPS,
        ),

        props: {
            ...props,
            answerCaptions,
            questionInSeconds,
            answerInSeconds,
            thanksInSeconds,
            audioQuestionFileUrl,
            audioAnswerFileUrl,
            defaultOutName: props.questionText
        },
        fps: FPS,
    };
};



export const RemotionRoot: React.FC = () => {
    return (
        <Composition
            id="Audiogram"
            component={Audiogram}
            width={1920}
            height={1080}
            schema={audiogramSchema}
            defaultProps={{
                questionText:
                    "在“白右”的世界观里，华人真的比其他种族要高一档吗？",
                answerText:
                    "作者：Afterwards 来源：知乎 这其实是个很有意思的话题。美国的建制派左翼现在最大的矛盾（没有之一）是The China Question。他们现在在推的整个意识形态和经济政策，包括有限言论控制，环境保护，统一大市场，国际多边主义，等等，几乎和中国现行政策一模一样。甚至连产业规划的细节都一样。他们要是真信他们那一套，就应该马上投入敌营。但他们又必须反华。这就是为什么近年左翼建制派出了不少言论有极强种族主义背景的魔怔人——这是他们为了调解内部矛盾，必须使用的策略。而美国右派，尤其是种族主义强的右派，最大的矛盾是The Chinese Question。具体而言，他们相信种族有别，白人天生就是比黑人聪明，有耐心，有责任心，“进化更充沛”。但随着美国亚裔变多，他们从身边的例子就能发现，他们跟亚裔比，自己就是黑人。他们对此的理论是，白人虽然没亚裔聪明，但有生命力，有野心，有宏大的精神追求。但有一定理论基础的种族主义者，会发现，虽然美国的亚裔没什么精神追求和生命力，但中国人有。另一些人认为日本人或者蒙古人有。白右对自己比黑人和阿拉伯人高一档没有任何争议，但对中国人是比自己高一档，还是低三档，有很多争议。这些人都有一定程度的精神疾病。没必要细究他们的理论。他们自己都没仔细想过这些问题。",
                answerCaptions: undefined,
                audioAnswerFileUrl: undefined,
                audioQuestionFileUrl: undefined,
                questionInSeconds: 0,
                answerInSeconds: 0,
                audioThanksFileUrl: staticFile("thanks.mp3"),
                onlyDisplayCurrentSentence: false,

            }}
            // Determine the length of the video based on the duration of the audio file
            // 下面这个函数主要用于渲染前计算内容的参数
            calculateMetadata={calculateMetadata}
        />
    );
};
