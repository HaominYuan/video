import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, useVideoConfig } from "remotion";

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
    audioFileUrl,
    coverImageUrl,
    titleText,
    titleColor,
    captionsTextColor,
    onlyDisplayCurrentSentence,
    audioOffsetInSeconds,
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
    const audioOffsetInFrames = Math.round(audioOffsetInSeconds * fps);

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
            {/* 这里的from是指这个组件从第几帧开始渲染 用于设置从音频的第几帧开始播放 不需要剪切视频了 */}
            <Sequence from={-audioOffsetInFrames}>
                {/* 播放音频 */}
                <Audio pauseWhenBuffering src={audioFileUrl} />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        height: "100%",
                        color: "white",
                        padding: "48px",
                        backgroundColor: "black",
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
                        {/* <Img
                            style={{
                                borderRadius: "6px",
                                maxHeight: "250px",
                            }}
                            src={coverImageUrl}
                        /> */}
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
                                startFrame={audioOffsetInFrames}
                                endFrame={audioOffsetInFrames + durationInFrames}
                                linesPerPage={LINES_PER_PAGE}
                                subtitlesTextColor={captionsTextColor}
                                onlyDisplayCurrentSentence={onlyDisplayCurrentSentence}
                                textBoxWidth={textBoxWidth}
                            />
                        </div>
                    </WaitForFonts>
                </div>
            </Sequence>

        </AbsoluteFill>
    );
};
