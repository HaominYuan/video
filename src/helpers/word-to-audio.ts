import { createSRT, EdgeTTS } from "edge-tts-universal";
import srtParser2 from "srt-parser-2";
import { Caption } from "@remotion/captions";


async function uploadFile(file: Blob, filename: string): Promise<string> {
    const formData = new FormData();
    formData.append('mp3', file, filename);
    const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('File upload failed');
    }


    return (await response.json()).fileUrl;
}


export async function getAudioPathAndCaptions(text: string) {
    const voice = "zh-CN-YunjianNeural"
    const BASEPATH = "C:\\Users\\yuanhm\\Desktop\\video\\public\\"

    const tts = new EdgeTTS(text, voice, {
        rate: '+20%',
    });
    const { audio, subtitle } = await tts.synthesize()
    const timestamp = Date.now();
    const filename = `audio_${timestamp}.mp3`;

    // const audioFilePath = URL.createObjectURL(audio);
    const audioFilePath = await uploadFile(audio, filename);






    const srtContent = createSRT(subtitle);
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



async function convert(word: string, mp3Name: string, capitonName: string) {
    const voice = "zh-CN-YunjianNeural"
    const BASEPATH = "C:\\Users\\yuanhm\\Desktop\\video\\public\\"
    const OUTPUT_FILE_MP3 = BASEPATH + "\\" + mp3Name + ".mp3"
    const OUTPUT_FILE_JSON = BASEPATH + "\\" + capitonName + ".json"

    const tts = new EdgeTTS(word, voice, {
        rate: '+20%',
    });

    const result = await tts.synthesize()

    const audioBuffer = Buffer.from(await result.audio.arrayBuffer());
    await fs.writeFile(OUTPUT_FILE_MP3, audioBuffer);

    const srtContent = createSRT(result.subtitle);
    const parser = new srtParser2();
    const srtArray = parser.fromSrt(srtContent);

    const data = srtArray.map(({ text, startSeconds, endSeconds }: {
        text: string,
        startSeconds: number,
        endSeconds: number
    }
    ) => {
        return {
            text,
            startMs: startSeconds * 1000,
            endMs: endSeconds * 1000,
        }
    })

    fs.writeFile(OUTPUT_FILE_JSON, JSON.stringify(data, null, 2));
}


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

