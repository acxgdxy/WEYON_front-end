<script setup lang="ts">
import { Download, Loading, CheckOne} from "@icon-park/vue-next";
import type { Theme } from "@icon-park/vue-next/lib/runtime";
import { getDownload } from "@/libs/gpt";
import { ref } from "vue";

const porps = defineProps<{ url: string }>();
const btnConfig: {
  size: number;
  fill: string;
  theme: Theme;
} = {
  size: 14,
  fill: "#999",
  theme: "outline",
};
const btnTips = {
  download: "下载文件",
  loading: "",
  success: "成功下载！",
  error: "下载失败！",
};
const btnStatus = ref<"download" | "loading" | "success" | "error">("download");

const DownloadDocument = (content: string = porps.url) => {
  btnStatus.value = "loading";
  getDownload(content, '')
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const fileName = 'test.csv';
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        console.log("下载成功");
      })
      .catch(() => (btnStatus.value = "error"))
      .finally(() => setTimeout(() => (btnStatus.value = "download"), 1500));
};
</script>

<template>
  <div class="flex items-center cursor-pointer" @click="DownloadDocument()">
    <download
        v-show="btnStatus === 'download'"
        :theme="btnConfig.theme"
        :size="btnConfig.size"
        :fill="btnConfig.fill"
    />
    <loading
        class="rotate"
        v-show="btnStatus === 'loading'"
        :theme="btnConfig.theme"
        :size="btnConfig.size"
        :fill="btnConfig.fill"
    />
    <check-one
        v-show="btnStatus === 'success'"
        :theme="btnConfig.theme"
        :size="btnConfig.size"
        :fill="btnConfig.fill"
    />
    <close-one
        v-show="btnStatus === 'error'"
        :theme="btnConfig.theme"
        :size="btnConfig.size"
        :fill="btnConfig.fill"
    />
    <span class="text-xs ml-0.5 text-gray-500 leading-none">
      {{btnTips[btnStatus]}}
    </span>
  </div>
</template>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.rotate {
  animation: spin 2s linear infinite;
}
</style>
