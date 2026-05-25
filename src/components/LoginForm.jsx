import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const { signInWithMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError('')

    const { error: authError } = await signInWithMagicLink(email)

    if (authError) {
      setError(authError.message || 'Có lỗi xảy ra. Thử lại nhé!')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Kiểm tra email!</h2>
          <p className="text-sm text-gray-500">
            Mình đã gửi magic link đến <strong>{email}</strong>.
            Click link trong email để đăng nhập.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Project<span className="text-green-600">Me</span>30
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            30 ngày thay đổi. Bắt đầu hành trình của bạn.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-400 transition-all"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? 'Đang gửi...' : 'Đăng nhập bằng Magic Link ✨'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Không cần mật khẩu. Chỉ cần email.
        </p>
      </div>
    </div>
  )
}
