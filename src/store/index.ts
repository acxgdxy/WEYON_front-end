import {defineStore} from "pinia";
import type {ChatMessage} from "@/types";
import {ref, computed} from "vue";
import {Client} from "@gradio/client";
export const useCounterStore = defineStore('counter', () => {
    const countNumber = ref(0)
    const doubleCount = computed(() => countNumber.value * 2)

    function increment() {
        countNumber.value++
    }

    return {countNumber, doubleCount, increment}
})

export const Api = defineStore('api', {
    state: () => {
        return {
            url: "/chain",
            name: 'chain',
            messageList: <ChatMessage[]>([
                {
                    role: "system",
                    content: "我是小云，尽可能简洁地回答。",
                    document: false,
                },
                {
                    role: "assistant",
                    content: `你好，我是小云，我可以提供一些常用服务和信息，例如：
                   
1. 翻译：我可以把中文翻译成英文，英文翻译成中文，还有其他一些语言翻译，比如法语、日语、西班牙语等。

2. 咨询服务：如果你有任何问题需要咨询，例如健康、法律、投资等方面，我可以尽可能为你提供帮助。

3. 闲聊：如果你感到寂寞或无聊，我们可以聊一些有趣的话题，以减轻你的压力。

请告诉我你需要哪方面的帮助，我会根据你的需求给你提供相应的信息和建议。`,
                    document: false,
                },
            ])
        }
    },
    actions: {
        async sendMessage() {
            const newUrl = "http://192.168.100.74:7860" + this.url;
            const client = await Client.connect(newUrl)
            return await client.predict("/chat", {
                message: this.messageList[this.messageList.length - 2].content,
            });
        }
    }
})
