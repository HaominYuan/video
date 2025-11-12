import srtParser2 from 'srt-parser-2';
import fs from 'fs/promises';
import express from 'express';
import { join } from 'path'
import cors from 'cors';
import crypto from 'crypto';
import { createSRT, EdgeTTS } from 'edge-tts-universal';

function sha256Hash(data: string) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

async function checkFileExists(filePath: string) {
    try {
        await fs.access(filePath);
        // console.log(`文件 "${filePath}" 存在`);
        return true;
    } catch (error) {
        // console.error(`文件 "${filePath}" 不存在或无权限: ${error.message}`);
        return false;
    }
}


const BASEPATH = join(process.cwd(), 'public');


const app = express()
const port = 4000
app.use(express.json());

app.use(cors())

app.use('/static', express.static(BASEPATH))



app.post('/generate', async (req, res) => {
    const { text }: {
        text: string,
    } = req.body; // Access the parsed JSON data

    const hashData = sha256Hash(text);

    const isExit = await checkFileExists(join(BASEPATH, `${hashData}.mp3`));

    if (isExit) {

        const captions = await fs.readFile(join(BASEPATH, `${hashData}.json`)).then((data) => {
            return JSON.parse(data.toString());
        })

        res.json({
            audioFilePath: `http://localhost:4000/static/${hashData}.mp3`,
            captions
        })

        res.end()
    } else {

        const voice = "zh-CN-YunjianNeural"

        const tts = new EdgeTTS(text, voice, {
            rate: '+20%',
        });
        const { audio, subtitle } = await tts.synthesize()

        const audioBuffer = Buffer.from(await audio.arrayBuffer());
        await fs.writeFile(join(BASEPATH, `${hashData}.mp3`), audioBuffer);


        const srtContent = createSRT(subtitle);
        const parser = new srtParser2();
        const srtArray = parser.fromSrt(srtContent);

        const captions = srtArray.map(({ text, startSeconds, endSeconds }: {
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

        await fs.writeFile(join(BASEPATH, `${hashData}.json`), JSON.stringify(captions, null, 2));

        res.json({
            audioFilePath: `http://localhost:4000/static/${hashData}.mp3`,
            captions
        })
        res.end()
    }
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
