<template>
  <div class="flex flex-col">
    <div>
      <div class="flex flex-row">
        <input type="text" id="input1" placeholder="中文男，中文女" v-model="spk_id" class="flex-1 h-64 w-32 p-4 border-4">
        <input type="text" id="div2" placeholder="Text" v-model="txt" class="flex-1 h-64 w-32 p-4 border-4">
        <input type="text" id="input3" placeholder="Description" v-model="description"
               class="flex-1 h-64 w-32 p-4 border-4">
        <div class="flex-1 h-64 w-32 p-4 border-4">
          <upload/>
        </div>
        <input type="file" class="flex-1 h-64 w-32 p-4 border-4" ref="img" accept=".jpg,.png," @change="onChange"/>
      </div>
    </div>
    <button @click="sendData()" class="flex-1 bg-gradient-to-b from-yellow-400 to-red-500 ">Send Data</button>

    <video class="" ref="video" controls autoplay></video>

  </div>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {FileDocument} from "@/store";
import upload from "@/components/upload.vue";
import Upload from "@/components/upload.vue";

let spk_id = ref();
let txt = ref();
let description = ref();
let video = ref();
let img = ref();
let base = "http://192.168.100.111:5218"
let url = "http://192.168.100.111:5218/dp-api/create-video";
let videoUrl = "http://192.168.100.111:5218/dp-api/create-task";
let get_task = "http://192.168.100.111:5218/dp-api/get-task"
const file = FileDocument();
let imgArray: any[] = [];
let name_uuid: string = '';
let bg_replace: number = 0;
let video_format: String = "";
let img_format: String = "";
let timer: any = ''  // 设置定时器
// alert("注意name与txt中不能出现空格")
function onChange() {
  imgArray = [...img.value.files]
}


async function sendData() {

  let str = txt.value;
  let newStr = str.replace(/\s+/g, '');
  const formData = new FormData();
  file.files.forEach((item) => {
    formData.append("selectedFiles", item);
  });
  imgArray.forEach((item) => {
    formData.append('backgroundImg', item);
  })
  await fetch(videoUrl, {
    // mode: 'no-cors',
    method: "POST",
    body: formData,
  }).then((data) => {
    return data.json()
  }).then(json => {
    name_uuid = json.task_id;
    bg_replace = json.bg_replace;
    video_format = json.video_format;
    img_format = json.img_format;
    console.log(name_uuid)
  })

  let data = {
    task_id: name_uuid,
    text: newStr,
    description: description.value === "" ? " " : description.value,
    spk_id: spk_id.value,
    bg_replace,
    video_format,
    img_format
  }
  console.log(data)
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  }).then(res => {
    if (!res.ok) {
      alert("错误")
      throw Error('错误')
    }
    polling()
    // return res.blob();
  })
  // .then(blob => {
  // video.value.src = window.URL.createObjectURL(blob);
  // video.value.load();
  // alert('Data sent successfully!');
  // })
}


// 轮询
const polling = () => {
  timer = setInterval(() => {
    setTimeout(() => {
      const data = {
        task_id: name_uuid,
      }
      fetch(get_task, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      }).then((res) => {
        return res.json()
      }).then(json => {
        if (json.status === 'Created') {
          clearInterval(timer)
          console.log("nnihao", json.dp_mp4_url)
          fetch(base + json.dp_mp4_url, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          }).then((res) => {
            return res.blob()
          }).then(blob => {
            video.value.src = window.URL.createObjectURL(blob);
            video.value.load();
            alert('Data sent successfully!');
            clearInterval(timer)
          })
          clearInterval(timer)
        } else {
          console.log("还没结束")
        }
      })
    }, 0)
  }, 5000);
}


</script>

<style scoped>
input, button {
  outline: none;
}
</style>
