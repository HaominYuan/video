import React from "react";
import { AbsoluteFill, Audio, Sequence, useVideoConfig } from "remotion";

import { PaginatedCaptions } from "./Captions";
import {
    BASE_SIZE,
    CAPTIONS_FONT_SIZE,
    CAPTIONS_FONT_WEIGHT,
    LINE_HEIGHT,
    LINES_PER_PAGE,
} from "./constants";
import { FONT_FAMILY } from "./font";
import { WaitForFonts } from "./WaitForFonts";
import { AudiogramCompositionSchemaType } from "./schema";

export const Audiogram: React.FC<AudiogramCompositionSchemaType> = ({
    audioQuestionFileUrl,
    questionInSeconds,
    audioAnswerFileUrl,
    answerInSeconds,
    audioThanksFileUrl,
    thanksInSeconds,
    titleText,
    titleColor,
    captionsTextColor,
    onlyDisplayCurrentSentence,
    captions,

}) => {
    // 获取这个ID视频的参数
    const { durationInFrames, fps, width } = useVideoConfig();

    if (!captions) {
        throw new Error(
            "subtitles should have been provided through calculateMetadata",
        );
    }

    // 计算视频的偏移量

    // 文本框大小
    const textBoxWidth = width - BASE_SIZE * 2;

    return (
        // 下面这个style是等同于AbsoluteFill的
        // const style: React.CSSProperties = {
        //     position: 'absolute',
        //     top: 0,
        //     left: 0,
        //     right: 0,
        //     bottom: 0,
        //     width: '100%',
        //     height: '100%',
        //     display: 'flex',
        //     flexDirection: 'column',
        // };
        <AbsoluteFill>
            <Sequence durationInFrames={questionInSeconds * fps}>
                <Audio pauseWhenBuffering src={audioQuestionFileUrl} />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        padding: "48px",
                        backgroundColor: "white",
                        fontFamily: FONT_FAMILY,

                        lineHeight: "1.25",
                        fontWeight: 800,
                        color: titleColor,
                        fontSize: "144px",
                    }}
                >

                    <div
                        style={{
                            width: "50%",

                        }}
                    >
                        {titleText}
                    </div>
                </div>
            </Sequence >


            {/* 这里的from是指这个组件从第几帧开始渲染 用于设置从音频的第几帧开始播放 不需要剪切视频了 */}
            <Sequence from={questionInSeconds * fps} durationInFrames={answerInSeconds * fps}>
                {/* 播放音频 */}
                <Audio pauseWhenBuffering src={audioAnswerFileUrl} />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        height: "100%",
                        padding: "48px",
                        backgroundColor: "white",
                        fontFamily: FONT_FAMILY,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >

                        <div
                            style={{
                                lineHeight: "1.25",
                                fontWeight: 800,
                                color: titleColor,
                                fontSize: "72px",
                            }}
                        >
                            {titleText}
                        </div>
                    </div>

                    {/* 加载字体 现在可以暂时不管，仅仅是一个加载字体的套件*/}
                    <WaitForFonts>
                        {/* 文本框内设置 */}
                        <div
                            style={{
                                lineHeight: `${LINE_HEIGHT}px`,
                                width: textBoxWidth,
                                fontWeight: CAPTIONS_FONT_WEIGHT,
                                fontSize: CAPTIONS_FONT_SIZE,
                                marginTop: BASE_SIZE,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <PaginatedCaptions
                                captions={captions}
                                startFrame={0}
                                endFrame={durationInFrames}
                                linesPerPage={LINES_PER_PAGE}
                                subtitlesTextColor={captionsTextColor}
                                onlyDisplayCurrentSentence={onlyDisplayCurrentSentence}
                                textBoxWidth={textBoxWidth}
                            />
                        </div>
                    </WaitForFonts>
                </div>
            </Sequence>
            <Sequence from={(questionInSeconds + answerInSeconds) * fps}>
                <Audio pauseWhenBuffering src={audioThanksFileUrl} />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        padding: "48px",
                        backgroundColor: "white",
                        fontFamily: FONT_FAMILY,
                        lineHeight: "1.25",
                        fontWeight: 800,
                        color: titleColor,
                        fontSize: "144px",
                    }}
                >
                    感谢观看
                </div>
            </Sequence>

        </AbsoluteFill>
    );
};
