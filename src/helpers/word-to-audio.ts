import { Caption } from "@remotion/captions";


export async function getAudioPathAndCaptions(text: string) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");



    const raw = JSON.stringify({
        text
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow' as RequestRedirect,
    };

    const { audioFilePath, captions }: {
        audioFilePath: string,
        captions: Caption[]
    } = await fetch("http://localhost:4000/generate", requestOptions)
        .then(response => response.json())


    return { audioFilePath, captions };
}