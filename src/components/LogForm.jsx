import { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'

const TAGS_OPTIONS = [
  { value: 'eat-clean', label: 'Ăn sạch' },
  { value: 'run-2km', label: 'Chạy 2km' },
  { value: 'run-3km', label: 'Chạy 3km' },
  { value: 'run-5km', label: 'Chạy 5km' },
  { value: 'gym', label: 'Gym' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'sleep-early', label: 'Ngủ sớm' },
  { value: 'walk', label: 'Đi bộ' },
  { value: 'home-workout', label: 'Tập ở nhà' },
  { value: 'fail', label: 'Bại trận' },
]

const MOOD_OPTIONS = [
  { value: 'good', label: 'Sung sức', emoji: '💪' },
  { value: 'ok', label: 'Ổn', emoji: '👌' },
  { value: 'bad', label: 'Mệt', emoji: '😮‍💨' },
]

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime']

export default function LogForm({ day, onSubmit, loading: externalLoading }) {
  const [mediaType, setMediaType] = useState('none')
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [tags, setTags] = useState([])
  const [mood, setMood] = useState('good')
  const [error, setError] = useState('')
  const [compressing, setCompressing] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      if (file.size > MAX_IMAGE_SIZE) {
        setError('Ảnh phải nhỏ hơn 5MB')
        return
      }

      setCompressing(true)
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        })
        setMediaFile(compressed)
        setMediaType('image')
        setMediaPreview(URL.createObjectURL(compressed))
      } catch {
        setError('Không thể nén ảnh. Vui lòng thử lại.')
      }
      setCompressing(false)
    } else if (ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      if (file.size > MAX_VIDEO_SIZE) {
        setError('Video phải nhỏ hơn 50MB')
        return
      }

      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src)
        if (video.duration > 30) {
          setError('Video tối đa 30 giây')
          return
        }
        setMediaFile(file)
        setMediaType('video')
        setMediaPreview(URL.createObjectURL(file))
      }
      video.src = URL.createObjectURL(file)
    } else {
      setError('Chỉ chấp nhận JPG, PNG, WEBP, MP4, MOV')
    }
  }

  const removeMedia = () => {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview)
    setMediaFile(null)
    setMediaPreview(null)
    setMediaType('none')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const toggleTag = (tag) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!caption.trim()) {
      setError('Hãy viết vài dòng cảm nhận!')
      return
    }

    const isFail = tags.includes('fail')

    await onSubmit({
      day,
      date: new Date().toISOString().split('T')[0],
      mood,
      caption: caption.trim(),
      tags,
      media_type: mediaType,
      media_file: mediaFile,
      completed: true,
      is_fail: isFail,
    })

    setCaption('')
    setTags([])
    setMood('good')
    removeMedia()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-6 px-4">
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          📝 Log ngày {day}
        </h3>

        {/* Media upload area */}
        <div className="mb-4">
          <div className="flex gap-2 mb-3">
            {[
              { type: 'image', icon: '📷', label: 'Ảnh' },
              { type: 'video', icon: '🎥', label: 'Video' },
              { type: 'none', icon: '✏️', label: 'Chỉ text' },
            ].map(opt => (
              <button
                key={opt.type}
                type="button"
                onClick={() => {
                  if (opt.type === 'none') {
                    removeMedia()
                  } else {
                    fileInputRef.current?.click()
                  }
                }}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                  transition-all cursor-pointer
                  ${mediaType === opt.type
                    ? 'bg-gray-800 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
            onChange={handleFileChange}
            className="hidden"
          />

          {compressing && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              Đang nén ảnh...
            </div>
          )}

          {mediaPreview && (
            <div className="relative mb-3">
              {mediaType === 'image' ? (
                <img src={mediaPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              ) : (
                <video src={mediaPreview} controls className="w-full h-48 object-cover rounded-lg" />
              )}
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Caption */}
        <textarea
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Hôm nay thế nào? Viết vài dòng cảm nhận..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-400 resize-none transition-all"
        />

        {/* Mood */}
        <div className="flex gap-2 mt-3 mb-3">
          {MOOD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMood(opt.value)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer
                transition-all
                ${mood === opt.value
                  ? 'bg-gray-800 text-white ring-2 ring-gray-800/20'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {TAGS_OPTIONS.map(tag => (
            <button
              key={tag.value}
              type="button"
              onClick={() => toggleTag(tag.value)}
              className={`
                px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer
                transition-all
                ${tags.includes(tag.value)
                  ? 'bg-gray-800 text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'
                }
              `}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 mb-3">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={externalLoading}
          className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 active:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {externalLoading ? 'Đang lưu...' : 'Lưu ngày này ✨'}
        </button>
      </div>
    </form>
  )
}
