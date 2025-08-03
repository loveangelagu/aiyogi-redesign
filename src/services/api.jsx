import axios from "axios"
const BASEURL = process.env.REACT_APP_API_URL;

export const get = (url) => {
    return axios.get(url)
}

export const post = (endpoint, data, headers) => {
    return axios.post(`${BASEURL}${endpoint}`, data, {headers});
}

export const stream = async (endpoint, body, headers) => {
    return await fetch(`${BASEURL}${endpoint}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers
    });

    // if (!response.ok) throw new Error(await response.text());

    // const reader = response.body.getReader();
    // const decoder = new TextDecoder();

    // return new ReadableStream({
    //     async start(controller) {
    //         while (true) {
    //             const { done, value } = await reader.read();
    //             if (done) {
    //                 controller.close();
    //                 break;
    //             }
    //             console.log("Chunk received:", value); // Stream updates in real time   
    //             controller.enqueue(decoder.decode(value, { stream: true }));
    //         }
    //     }
    // });
};