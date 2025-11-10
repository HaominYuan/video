import { fs } from 'fs/promises';
import { createSRT, EdgeTTS } from "edge-tts-universal";
import srtParser2 from "srt-parser-2";
import { Caption } from "@remotion/captions";


async function blobToBase64(blob: Blob) {
    if (typeof window !== 'undefined' && typeof FileReader !== 'undefined') {
        // Browser environment
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(blob);
        });
    } else if (typeof Buffer !== 'undefined') {
        // Node.js environment
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer.toString('base64');
    } else {
        throw new Error('Unsupported environment for Blob to Base64 conversion.');
    }
}

export async function getAudioPathAndCaptions(text: string) {
    const voice = "zh-CN-YunjianNeural"
    const BASEPATH = "C:\\Users\\yuanhm\\Desktop\\video\\public\\"

    const tts = new EdgeTTS(text, voice, {
        rate: '+20%',
    });
    const result = await tts.synthesize()
    const audioFilePath = URL.createObjectURL(result.audio);



    const srtContent = createSRT(result.subtitle);
    const parser = new srtParser2();
    const srtArray = parser.fromSrt(srtContent);

    const captions: Caption[] = srtArray.map(({ text, startSeconds, endSeconds }: {
        text: string,
        startSeconds: number,
        endSeconds: number
    }
    ) => {
        return {
            text,
            startMs: startSeconds * 1000,
            endMs: endSeconds * 1000,
            timestampMs: null,
            confidence: null
        }
    })

    return { audioFilePath, captions };
}



// async function convert(word: string, mp3Name: string, jsonName: string) {
//     const voice = "zh-CN-YunjianNeural"
//     const BASEPATH = "C:\\Users\\yuanhm\\Desktop\\video\\public\\"
//     const OUTPUT_FILE_MP3 = BASEPATH + "\\" + mp3Name + ".mp3"
//     const OUTPUT_FILE_JSON = BASEPATH + "\\" + jsonName + ".json"

//     const tts = new EdgeTTS(word, voice, {
//         rate: '+20%',
//     });

//     const result = await tts.synthesize()

//     const audioBuffer = Buffer.from(await result.audio.arrayBuffer());
//     await fs.writeFile(OUTPUT_FILE_MP3, audioBuffer);

//     const srtContent = createSRT(result.subtitle);
//     const parser = new srtParser2();
//     const srtArray = parser.fromSrt(srtContent);

//     const data = srtArray.map(({ text, startSeconds, endSeconds }: {
//         text: string,
//         startSeconds: number,
//         endSeconds: number
//     }
//     ) => {
//         return {
//             text,
//             startMs: startSeconds * 1000,
//             endMs: endSeconds * 1000,
//         }
//     })

//     fs.writeFile(OUTPUT_FILE_JSON, JSON.stringify(data, null, 2));
// }


// async function readFile(path: string) {
//     const lines = fs.readFile(path, { encoding: "utf-8" }).split("\n");
//     const question = lines[0]
//     const answer = lines.slice(1).join("\n")
//     return { question, answer };
// }



// const { question, answer } = await readFile("C:\\Users\\yuanhm\\Desktop\\video\\input\\a.txt")
// convert(question, "question", "question");
// convert(answer, "answer", "answer");

// convert("感谢您的收听欢迎点赞评论转发", "thanks", "thanks");

