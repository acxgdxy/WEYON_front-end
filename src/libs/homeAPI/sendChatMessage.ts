// import {nextTick, onMounted, watch} from "vue/dist/vue";
// import {chat} from "@/libs/gpt";
import cryptoJS from "crypto-js";
//
// onMounted(() => {
//     if (getAPIKey()) {
//         switchConfigStatus();
//     }
// });
//
// //发送promote
// const sendChatMessage = async (content: string = messageContent.value) => {
//     try {
//         isTalking.value = true;
//         if (messageList.value.length === 2) {
//             messageList.value.pop();
//         }
//         messageList.value.push({role: "human", content, document: false});
//         clearMessageContent();
//         messageList.value.push({role: "assistant", content: "", document: false});
//
//         const {body, status, headers} = await chat(messageList.value, getAPIKey());
//
//         console.log(headers.get('Content-Type'))
//
//         if (headers.get('Content-Type') === 'text/csv; charset=utf-8') {
//             messageList.value[messageList.value.length - 1].document = true;
//             messageCSV.value = true;
//             console.log(messageCSV.value)
//         }
//         if (body) {
//             const reader = body.getReader();
//             await readStream(reader, status);
//         }
//
//     } catch (error: any) {
//         appendLastMessageContent(error);
//     } finally {
//         isTalking.value = false;
//     }
// };
//
// function StringManipulation(data: string) {
//     let newData = data.trim().split(/\\n/);
//     console.log("new", newData)
//     const regex: RegExp = /"[^"]*"|[^\s,'"]+(?:\s+[^\s,'"]+)*|(?<=,)\s*(?=,)/g;
//     let veliable: string [] = [];
//     newData.forEach(s => {
//         if (count > 12) {
//             return;
//         }
//         console.log("s", s);
//         veliable[count] = "|";
//         if (count === 0) {
//             veliable[count + 1] = "|";
//             count = 1;
//         }
//         const array = s.match(regex);
//         array.forEach((item) => {
//             if (count === 1) {
//                 veliable[count - 1] = veliable[count - 1] + item + '|';
//                 veliable[count] = veliable[count] + ':---:|';
//             } else {
//                 veliable[count] = veliable[count] + item + '|';
//             }
//         })
//         count++;
//     })
//     return veliable.map((data: String, index) => {
//         return data + '\n';
//     });
// }
//
// function StreamOutput(data: string) {
//     let newData = data.trim().split(/\n\n/);
//     return newData.map((data: String,) => {
//         if (data.indexOf("finish_reason") != -1) {
//             console.log("结束");
//             const jsonString = JSON.stringify(data.replace(" finish_reason", ""));
//             return JSON.parse(jsonString);
//         }
//
//         const jsonString = data.substring(0);
//         return JSON.parse(jsonString);
//     });
// }
//
//
// //处理流式数据
// const readStream = async (
//     reader: ReadableStreamDefaultReader<Uint8Array>,
//     status: number
// ) => {
//
//     while (true) {
//         const {value, done} = await reader.read();
//         if (done) break;
//         const decodedText = decoder.decode(value, {stream: true});
//         if (status !== 200) {
//             const json = JSON.parse(decodedText); // start with "data: "
//             const content = json.error.message ?? decodedText;
//             appendLastMessageContent(content);
//             return;
//         }
//
//         // const newLines = decodedText.trim().split(/\n/);
//         let jsonObject: string[] = [];
//         if (messageCSV.value) jsonObject = StringManipulation(decodedText);
//         else jsonObject = StreamOutput(decodedText);
//
//
//         await jsonObject.forEach((item: any) => {
//             appendLastMessageContent(item);
//         })
//     }
// };
//
// //将流式传送的数据增添到消息队列
// const appendLastMessageContent = (content: string) => {
//     messageList.value[messageList.value.length - 1].content += content;
// }
//
//
// const sendOrSave = () => {
//     if (!messageContent.value.length) return;
//     if (isConfig.value) {
//         if (saveAPIKey(messageContent.value.trim())) {
//             switchConfigStatus();
//         }
//         clearMessageContent();
//     } else {
//         sendChatMessage();
//     }
// };
//
// const clickConfig = () => {
//     if (!isConfig.value) {
//         messageContent.value = getAPIKey();
//     } else {
//         clearMessageContent();
//     }
//     switchConfigStatus();
// };
//
// const getSecretKey = () => "lianginx";
// const saveAPIKey = (apiKey: string) => {
//     // if (apiKey.slice(0, 3) !== "sk-" || apiKey.length !== 51) {
//     //   alert("API Key 错误，请检查后重新输入！");
//     //   return false;
//     // }
//     // const aesAPIKey = cryptoJS.AES.encrypt(apiKey, getSecretKey()).toString();
//     // localStorage.setItem("apiKey", aesAPIKey);
//
//     return true;
// };
//
// const getAPIKey = () => {
//     if (apiKey) return apiKey;
//     const aesAPIKey = localStorage.getItem("apiKey") ?? "";
//     apiKey = cryptoJS.AES.decrypt(aesAPIKey, getSecretKey()).toString(
//         cryptoJS.enc.Utf8
//     );
//     return apiKey;
// };
//
// const switchConfigStatus = () => (isConfig.value = !isConfig.value);
//
// const clearMessageContent = () => {
//     count = 0;
//     messageContent.value = ""
// };
//
// const scrollToBottom = () => {
//     if (!chatListDom.value) return;
//     scrollTo(0, chatListDom.value.scrollHeight);
// };
//
// watch(messageList.value, () => {
//     // count++;
//     // console.log("监听成功", messageList.value, count);
//     nextTick(() => scrollToBottom())
// }, {
//     deep: true
// });
