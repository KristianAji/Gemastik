import { useStore } from '../store/useStore'

export default function Toast() {
  const toast = useStore(s => s.toast)
  return (
    <div className={`toast${toast ? ' show' : ''}`}
      style={{ background: toast?.color || 'var(--green)' }}>
      {toast?.msg}
    </div>
  )
}