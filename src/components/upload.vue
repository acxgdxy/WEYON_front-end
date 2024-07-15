<template>
  <div class="main">
    <div
        class="dropzone-container"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
    >
      <input
          type="file"
          multiple
          name="file"
          id="fileInput"
          class="hidden-input"
          @change="onChange"
          ref="fileInputRef"
          accept=".avi,.mp4"
      />

      <label for="fileInput" class="file-label">
        <div v-if="isDragging">释放以将文件放到此处。</div>
        <div v-else>将文件拖到此处或单击此处上传。</div>
      </label>

      <div class="preview-container mt-4" v-if="file.files.length">
        <div v-for="file in file.files" :key="file.name" class="preview-card">
          <div>
            <p>
              {{ file.name }}
            </p>
          </div>
          <div>
            <button
                class="ml-2"
                type="button"
                @click="remove(file.files.indexOf(file))"
                title="Remove file"
            >
              <b>×</b>
            </button>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>

import {ref} from 'vue'
import {FileDocument} from "@/store";

const isDragging = ref(false)
const fileInputRef = ref(null)
const file = FileDocument();

function onChange() {
  file.files = [...fileInputRef.value.files]
  console.log("asdasdas", file.files)
}

function dragover(e) {
  e.preventDefault()
  isDragging.value = true
}

function dragleave() {
  isDragging.value = false
}

function drop(e) {
  e.preventDefault()
  fileInputRef.value.files = e.dataTransfer.files
  onChange()
  isDragging.value = false
}

function remove(i) {
  file.files.splice(i, 1)
}

function generateURL(file) {
  let fileSrc = URL.createObjectURL(file);
  setTimeout(() => {
    URL.revokeObjectURL(fileSrc);
  }, 1000);
  return fileSrc;
}

</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .main {
    @apply flex grow items-center justify-center h-auto text-center;
  }

  .dropzone-container {
    @apply p-16 bg-[#f7fafc] border border-solid border-[#e2e8f0];
  }

  .hidden-input {
    @apply opacity-0 overflow-hidden absolute w-1 h-2;
  }

  .file-label {
    @apply text-xl block cursor-pointer;
  }

  .preview-container {
    @apply flex mt-8;
  }

  .preview-card {
    @apply flex border border-solid border-[#a2a2a2] p-2 ml-2;
  }

  .preview-img {
    @apply w-14 h-14 rounded-md border border-solid border-[#a2a2a2] bg-[#a2a2a2];
  }
}

</style>
