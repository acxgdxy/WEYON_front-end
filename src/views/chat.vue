<template>
  <div class="flex flex-col h-screen">
    <!--    导航栏-->
    <div
        class="flex flex-nowrap fixed w-full items-baseline top-0 px-6 py-4 bg-gray-100"
    >
      <div class="text-2xl font-bold">云研</div>
      <div class="ml-4 text-sm text-gray-500">
        自然语言模型人工智能对话
      </div>
      <div
          class="ml-auto px-3 py-2 text-sm cursor-pointer hover:bg-white rounded-md">
        <!--          @click="clickConfig()"-->

        <DropDownBox/>
      </div>
    </div>

    <div class="flex-1 mx-2 mb-2">
      <div class="flex flex-row">

        <!--        左边-->
        <div class="flex-1  border-2 border-b-gray-500">
          <input type="hidden" ref="sessionid" value="1234">
          <div class="flex flex-row h-screen">
            <div id="media" class="flex-1  mx-2 mt-20 mb-2 overflow-auto" style="z-index: 100;">
              <audio ref="audio" autoplay="true"></audio>
              <video ref="video" style="width:600px;" autoplay="true" playsinline="true"></video>
            </div>
          </div>
        </div>

        <!--        右边-->
        <div class="flex-1">

          <div
              class="flex flex-col h-screen border-2 border-b-gray-500"

          >
            <!--    消息列表区域-->
            <div class="flex-1 mx-2 mt-20 mb-2 overflow-auto" ref="chatListDom">
              <div
                  class="group flex flex-col px-4 py-3 hover:bg-slate-100 rounded-lg "
                  v-for="item of store.messageList.filter((v) => v.role !== 'system')"
              >
                <div class="flex justify-between items-center mb-2">
                  <div class="font-bold">{{ roleAlias[item.role] }}：</div>
                  <Copy class="invisible group-hover:visible" :content="item.content" v-if="!item.document"/>
                  <Download class="invisible group-hover:visible" v-else-if="item.document" :url="downloadUrl"/>
                </div>
                <div>
                  <div
                      style="overflow-x:auto"
                      class="text-sm text-slate-600 leading-relaxed"
                      :class="{'max-w-prose': !item.document}"
                      v-if="item.content"
                      v-html="md.render(item.content)"
                  ></div>
                  <Loding v-else/>
                </div>
              </div>
            </div>


            <!--    输入区域-->
            <div class="sticky bottom-0 w-full p-6 pb-8 bg-gray-100">
              <div class="-mt-2 mb-2 text-sm text-gray-500" v-if="isConfig">
                请输入 API Key：
              </div>
              <div class="flex">
                <!--        isConfig状态不同展示不同的内容 true代表还没有配置密钥，false代表配置密钥成功-->
                <input
                    class="input"
                    :type="isConfig ? 'password' : 'text'"
                    :placeholder="isConfig ? 'sk-xxxxxxxxxx' : '请输入'"
                    v-model="messageContent"
                    @keydown.enter="isTalking || sendOrSave()"
                />
                <button class="btn" :disabled="isTalking" @click="sendOrSave()">
                  {{ isConfig ? "保存" : "发送" }}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Api} from "@/store";
import {nextTick, onMounted, ref, watch} from "vue";
//两组件的内容
import Loding from "@/components/Loding.vue";
import Copy from "@/components/Copy.vue";
import Download from "@/components/Download.vue";
import DropDownBox from "@/components/DropDownBox.vue";
//以markdown的形式输出文档
import {md} from "@/libs/markdown";
import cryptoJS from "crypto-js";
import {submit} from "@gradio/client";


// ref定义的响应式变量
let apiKey = "";
let isConfig = ref(true);
let isTalking = ref(false);
let messageContent = ref("");
let messageCSV = ref(false);
// let messageExcel = ref(false);
let downloadUrl = "table/test3";
//控制csv转化为markdown
let count = 0;
const chatListDom = ref<HTMLDivElement>();
const decoder = new TextDecoder("utf-8");
const roleAlias = {human: "ME", assistant: "小云", system: "System"};

const store = Api();
const url = "http://192.168.100.111:8010"
let video = ref();
let audio = ref();
let sessionid = ref();
const config = {
  sdpSemantics: 'unified-plan'
};
let pc = new RTCPeerConnection(config);

function submitText(content: string) {
  console.log("3", content)

  fetch(url + '/human', {
    body: JSON.stringify({
      text: content,
      type: 'echo',
      interrupt: true,
      sessionid: parseInt(sessionid.value.value),
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }).then((e) => {
    console.log(e)
  }).catch((erre) => {
    console.log(erre)
  })
}


function start() {
  console.log("1");
  pc.addEventListener('track', (evt) => {
    if (evt.track.kind == 'video') {
      video.value.srcObject = evt.streams[0];
    } else {
      const audio = ref();
      audio.value.srcObject = evt.streams[0];
    }
  });
  negotiate();
  console.log("2");
  // document.getElementById('start').style.display = 'none';
  // document.getElementById('stop').style.display = 'inline-block';
}

function negotiate() {
  pc.addTransceiver('video', {direction: 'recvonly'});
  pc.addTransceiver('audio', {direction: 'recvonly'});
  return pc.createOffer().then((offer) => {
    return pc.setLocalDescription(offer);
  }).then(() => {
    // wait for ICE gathering to complete
    return new Promise((resolve) => {
      if (pc.iceGatheringState === 'complete') {
        resolve("成功");
      } else {
        const checkState = () => {
          if (pc.iceGatheringState === 'complete') {
            pc.removeEventListener('icegatheringstatechange', checkState);
            resolve("成功");
          }
        };
        pc.addEventListener('icegatheringstatechange', checkState);
      }
    });
  }).then(() => {
    let offer = pc.localDescription;
    return fetch(url + '/offer', {
      body: JSON.stringify({
        sdp: offer.sdp,
        type: offer.type,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
  }).then((response) => {
    return response.json();
  }).then((answer) => {
    sessionid.value.value = answer.sessionid
    return pc.setRemoteDescription(answer);
  }).catch((e) => {
    alert(e);
  });
}


// async function () {
//   const client = await Client.connect("http://192.168.100.74:7860/chain/");
//   return await client.predict("/chat", {
//     message: "请介绍下湖南大众传媒职业技术学院",
//   });
//
// }

onMounted(() => {
  if (getAPIKey()) {
    switchConfigStatus();
  }
});
const sendChatMessage = async (content: string = messageContent.value) => {
  try {
    isTalking.value = true;
    console.log(store.messageList)
    if (store.messageList.length === 2) {
      store.messageList.pop();
    }
    store.messageList.push({role: "human", content, document: false});
    clearMessageContent();
    store.messageList.push({role: "assistant", content: "", document: false});
    const result = store.sendMessage()
    result.then((res) => {
      submitText(res.data[0]); //传递给数字人模型回答后的数据
      appendLastMessageContent(res.data[0]);
    })

  } catch (error: any) {
    appendLastMessageContent(error);
  } finally {
    isTalking.value = false;
  }
};

const appendLastMessageContent = (content: string) => {
  store.messageList[store.messageList.length - 1].content += content;
}

const sendOrSave = () => {
  if (!messageContent.value.length) {
    alert("请输入需要查询的问题");
    return;
  }
  if (isConfig.value) {
    if (saveAPIKey(messageContent.value.trim())) {
      start();
      switchConfigStatus();
    }
    clearMessageContent();
  } else {

    sendChatMessage();
  }
};

const clickConfig = () => {
  if (!isConfig.value) {
    messageContent.value = getAPIKey();
  } else {
    clearMessageContent();
  }
  switchConfigStatus();
};

const getSecretKey = () => "lianginx";
const saveAPIKey = (apiKey: string) => {
  // if (apiKey.slice(0, 3) !== "sk-" || apiKey.length !== 51) {
  //   alert("API Key 错误，请检查后重新输入！");
  //   return false;
  // }
  // const aesAPIKey = cryptoJS.AES.encrypt(apiKey, getSecretKey()).toString();
  // localStorage.setItem("apiKey", aesAPIKey);

  return true;
};

const getAPIKey = () => {
  if (apiKey) return apiKey;
  const aesAPIKey = localStorage.getItem("apiKey") ?? "";
  apiKey = cryptoJS.AES.decrypt(aesAPIKey, getSecretKey()).toString(
      cryptoJS.enc.Utf8
  );
  return apiKey;
};

const switchConfigStatus = () => (isConfig.value = !isConfig.value);

const clearMessageContent = () => {
  count = 0;
  messageContent.value = ""
};

const scrollToBottom = () => {
  if (!chatListDom.value) return;
  scrollTo(0, chatListDom.value.scrollHeight);
};

watch(store.messageList, () => {
  nextTick(() => scrollToBottom())
}, {
  deep: true
});
</script>

<style scoped>
pre {
  font-family: -apple-system, "Noto Sans", "Helvetica Neue", Helvetica,
  "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB",
  "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN",
  "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti",
  SimHei, "WenQuanYi Zen Hei Sharp", sans-serif;
}

button {
  padding: 8px 16px;
}

video {
  width: 100%;
}


#media {
  max-width: 1280px;
}
</style>
