import type {ChatMessage} from "@/types";
import {Client} from "@gradio/client";

export async function chat(messageList: ChatMessage[], apiKey: string) {
    try {
        // console.log("nihap", messageList[messageList.length - 2].content);
        // const url = "/api/v1/completions"
        const url = "/api/post1/sse";
        // const url = "/api/post/sse";
        // const url = "/api/table/test";
        const result = await fetch(url, {
            method: "POST",
            // method: "POST",
            // signal: AbortSignal.timeout(8000),
            // 开启后到达设定时间会中断流式输出
            headers: {
                // "Content-Type": "application/json",
                "Content-Type": "text/csv",
                Authorization: `Bearer ${apiKey}`,
            },
            // body: JSON.stringify(
            //     // {
            //     //     role: "system",
            //     //     content: "You are a helpful translator. Translate the user sentence to Chinese"
            //     // },
            //     {
            //         // model: "qwen2",
            //         // stream: true,
            //         // role: messageList[messageList.length - 2].role,
            //         // content: messageList[messageList.length - 2].content,
            //         query: messageList[messageList.length - 2].content,
            //     }
            // ),
        });
        // console.log("re", result)
        return result;
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}

export async function getDownload(newUrl: string, apiKey: string) {
    try {
        const url = "/api/" + newUrl;
        console.log("访问下载链接", url);
        const result = await fetch(url, {
            method: "GET",
            headers: {
            },
        });
        return result;
    } catch (error) {
        console.log("error", error)
        throw error;
    }
}


export async function GradioChat(newUrl: string, url: string, messageList: ChatMessage[]) {
    const client = await Client.connect(newUrl);
    return await client.predict(url, {
        message: messageList[messageList.length - 2].content
    });
}
