export interface ISelect {
  label: string
  value: string
}

export interface IToggleOption {
  id: number | string
  label: string
  disabled?: boolean
}

export interface IUpload {
  file: File | null
  encodedImage: string | null
  name: string | null
  error: string | null
}
