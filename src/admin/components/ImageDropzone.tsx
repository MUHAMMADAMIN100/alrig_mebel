import { DragEvent, useId, useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { ICON_SIZE, ICON_STROKE } from '../lib/icons'
import classes from './image-dropzone.module.scss'

interface Props {
  multiple?: boolean
  files: File[]
  onChange(files: File[]): void
  hint?: string
}

/** Drag-drop зона загрузки изображений с превью. */
export const ImageDropzone = ({ multiple = true, files, onChange, hint }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setDragOver] = useState(false)
  const inputId = useId()

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const images = Array.from(incoming).filter((f) => f.type.startsWith('image/'))
    if (images.length === 0) return
    onChange(multiple ? [...files, ...images] : images.slice(0, 1))
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
    addFiles(event.dataTransfer.files)
  }

  const removeAt = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div
        className={isDragOver ? classes.zoneActive : classes.zone}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <ImagePlus className={classes.icon} size={ICON_SIZE.empty} strokeWidth={ICON_STROKE} />
        <p className={classes.text}>
          Перетащите {multiple ? 'фотографии' : 'фото'} сюда или <b>выберите файл</b>
        </p>
        {hint && <p className={classes.hint}>{hint}</p>}
        <input
          ref={inputRef}
          id={inputId}
          className={classes.input}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {files.length > 0 && (
        <div className={classes.previews}>
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className={classes.preview}>
              <img src={URL.createObjectURL(file)} alt={file.name} />
              <button
                type="button"
                className={classes.remove}
                onClick={() => removeAt(index)}
                aria-label="Убрать фото"
              >
                <X size={ICON_SIZE.mini} strokeWidth={ICON_STROKE} />
              </button>
              {multiple && index === 0 && <span className={classes.mainTag}>Главное</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
