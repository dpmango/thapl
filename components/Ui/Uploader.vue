<template>
  <div class="uploader">
    <div v-if="uploads.length > 0" class="uploader__list">
      <div v-for="(upload, idx) in uploads" :key="idx" class="preview">
        <div v-if="upload.error" className="preview__error">{{ upload.error }}</div>

        <div class="preview__remove" @click="removeAttachment(upload.id)">
          <nuxt-icon name="close"></nuxt-icon>
        </div>
        <div v-if="upload.encodedImage" class="preview__image">
          <img :src="upload.encodedImage" :alt="upload.name || ''" />
        </div>
        <div class="preview__title">{{ upload.name }}</div>
      </div>
    </div>

    <label v-else class="uploader__box" :for="`uploaderInputDom${id}`" @click="triggerUploader">
      <div class="uploader__icon">
        <nuxt-icon name="upload" />
      </div>
      <div class="uploader__label text-m">Прикрепить файл</div>
    </label>

    <Teleport to="body">
      <input
        :id="`uploaderInputDom${id}`"
        ref="uploaderInputDom"
        class="hidden-input"
        type="file"
        :multiple="maxFiles > 1"
        :maxlength="maxFiles"
        @change="handleFileSelect"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { IUpload } from '~/interface'
import { bytesToMegaBytes } from '#imports'

const id = nanoid(10)

const props = defineProps<{ maxFiles: number }>()

const emit = defineEmits(['onchange'])

const uploads = ref<IUpload[]>([])
const uploaderInputDom = ref<HTMLInputElement | null>(null)

const FILE_ALLOWED_MIME = ['image']
const FILE_MAX_MB = 5

const triggerUploader = () => {
  if (uploaderInputDom.value) {
    uploaderInputDom.value.value = ''
    uploaderInputDom.value.click()
  }
}

const handleFileSelect = async (e: any) => {
  const files = e.target.files as File[]

  const newFiles = [] as IUpload[]

  const awaitsReader = Array.from(files).map((file) => {
    const fileId = nanoid(10)

    const resultFile = {
      id: fileId,
      file,
      name: file.name,
      encodedImage: null,
      error: null,
    } as IUpload

    // limits
    const mimeType = file.type.split('/')[0]
    const sizeInMb = bytesToMegaBytes(file.size)

    if (mimeType && !FILE_ALLOWED_MIME.includes(mimeType)) {
      resultFile.error = 'Неверный формат файла'
    }

    if (sizeInMb && sizeInMb > FILE_MAX_MB) {
      resultFile.error = `Размер изображения превышает ${FILE_MAX_MB}Мб`
    }

    if (!resultFile.error) {
      if (newFiles.length >= props.maxFiles) {
        resultFile.error = `Можно выбрать максимум ${props.maxFiles} файлов`
      }
    }

    newFiles.push(resultFile)
    return blobToData(file)
  })

  await Promise.all(awaitsReader).then((res) => {
    res.forEach((readerData, idx) => {
      newFiles[idx].encodedImage = readerData as string
    })
  })

  uploads.value = newFiles
}

const removeAttachment = (id: string) => {
  uploads.value = uploads.value.filter((x) => x.id !== id)
}

watch(
  () => uploads.value,
  (newVal) => {
    emit(
      'onchange',
      newVal.filter((x) => !x.error)
    )
  }
)
</script>

<style lang="scss" scoped>
.uploader {
  margin-top: -1px;
  position: relative;
  z-index: 2;

  &__box {
    display: flex;
    align-items: center;
    padding: 12px 14px;
    color: var(--color-gray);
    border: 1px solid var(--color-border);
    border-radius: 0 0 12px 12px;
    cursor: pointer;
    transition: border 0.25s $ease, color 0.25s $ease;
    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }
  &__icon {
    flex: 0 0 auto;
    font-size: 0;
    margin-right: 14px;
    .nuxt-icon {
      font-size: 16px;
    }
  }
  &__label {
  }

  &__list {
    border: 1px solid var(--color-border);
    border-radius: 0 0 12px 12px;
  }
}

.hidden-input {
  z-index: 1;
  bottom: 0;
  left: 0;
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  pointer-events: none;
}

.preview {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 12px 14px 12px 56px;
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border);
  }

  &__remove {
    position: absolute;
    display: inline-flex;
    top: 50%;
    left: 14px;
    z-index: 2;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    background: var(--color-red);
    color: white;
    border-radius: 50%;
    transform: translateY(-50%);
    transition: background 0.25s ease;
    cursor: pointer;

    .nuxt-icon {
      font-size: 12px;
    }

    &:hover {
      color: white;
      background: var(--color-primary);
    }
  }

  &__image {
    position: relative;
    overflow: hidden;
    z-index: 1;
    width: 40px;
    height: 40px;
    margin-right: 16px;
    font-size: 0;
    border: 2px solid rgba(#fff, 0.2);
    border-radius: 8px;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__error {
    font-size: 12px;
    color: tomato;
  }

  &__title {
    overflow: hidden;
    flex: 1 1 calc(100% - 100px);
    margin-top: 6px;
    font-weight: 500;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
