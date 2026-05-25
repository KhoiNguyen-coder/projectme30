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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-xl font-black text-white mb-2">Kiểm tra email!</h2>
          <p className="text-sm text-white/50">
            Mình đã gửi magic link đến <strong className="text-white/70">{email}</strong>.
            Click link trong email để đăng nhập.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Project<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Me</span>30
          </h1>
          <p className="text-sm text-white/40 mt-3">
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
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 transition-all"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
            }}
          >
            {loading ? 'Đang gửi...' : 'Đăng nhập bằng Magic Link ✨'}
          </button>
        </form>

        <p className="text-center text-xs text-white/20 mt-6">
          Không cần mật khẩu. Chỉ cần email.
        </p>
      </div>
    </div>
  )
}
