import { useEffect, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { Button } from "../components/primitives"
import { portalCopy } from "../content/portal"
import { site } from "../content/site"

type Phase = "checking" | "locked" | "open" | "unavailable"

export default function Portal() {
  const [phase, setPhase] = useState<Phase>("checking")
  const [password, setPassword] = useState("")
  const [note, setNote] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [sentCount, setSentCount] = useState<number | null>(null)

  useEffect(() => {
    const previous = document.title
    document.title = `${portalCopy.title} · ${site.name}`
    const meta = document.createElement("meta")
    meta.name = "robots"
    meta.content = "noindex, nofollow"
    document.head.appendChild(meta)
    return () => {
      document.title = previous
      meta.remove()
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch("/api/portal-session")
      .then(async (response) => {
        if (cancelled) return
        if (response.status === 503) setPhase("unavailable")
        else setPhase(response.ok ? "open" : "locked")
      })
      .catch(() => {
        if (!cancelled) setPhase("locked")
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function signIn(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError("")
    try {
      const response = await fetch("/api/portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const body = await response.json().catch(() => ({}))
      if (response.status === 503) {
        setPhase("unavailable")
        return
      }
      if (!response.ok) {
        setError(body.error || portalCopy.passwordError)
        return
      }
      setPassword("")
      setPhase("open")
    } catch {
      setError(portalCopy.passwordError)
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    await fetch("/api/portal-session", { method: "DELETE" })
    setFiles([])
    setNote("")
    setSentCount(null)
    setPhase("locked")
  }

  function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    setSentCount(null)
    setError("")
    setFiles(Array.from(event.target.files ?? []).slice(0, 8))
  }

  async function send(event: FormEvent) {
    event.preventDefault()
    if (files.length === 0) {
      setError(portalCopy.empty)
      return
    }
    setBusy(true)
    setError("")
    try {
      const data = new FormData()
      data.set("note", note)
      for (const file of files) data.append("images", file)
      const response = await fetch("/api/portal-upload", {
        method: "POST",
        body: data,
      })
      const body = await response.json().catch(() => ({}))
      if (response.status === 401) {
        setPhase("locked")
        return
      }
      if (!response.ok) {
        setError(body.error || "The photos did not send.")
        return
      }
      setSentCount(body.count ?? files.length)
      setFiles([])
      setNote("")
    } catch {
      setError("The photos did not send.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="portal">
      <section className="portal__card">
        <p className="portal__eyebrow">{portalCopy.eyebrow}</p>
        <h1>{portalCopy.heading}</h1>
        {phase === "checking" && <p>Checking access.</p>}
        {phase === "unavailable" && <p>{portalCopy.unavailable}</p>}
        {phase === "locked" && (
          <form onSubmit={signIn}>
            <p>{portalCopy.lede}</p>
            <label>
              {portalCopy.passwordLabel}
              <input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </label>
            {error && <p className="portal__error">{error}</p>}
            <Button disabled={busy || !password} type="submit" variant="dark">
              {portalCopy.passwordButton}
            </Button>
          </form>
        )}
        {phase === "open" && (
          <form onSubmit={send}>
            <p>{portalCopy.uploadLede}</p>
            <label>
              {portalCopy.noteLabel}
              <textarea
                onChange={(event) => setNote(event.target.value)}
                placeholder={portalCopy.notePlaceholder}
                rows={3}
                value={note}
              />
            </label>
            <label className="portal__file">
              {portalCopy.fileLabel}
              <input
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                multiple
                onChange={chooseFiles}
                type="file"
              />
              <small>{portalCopy.fileHint}</small>
            </label>
            {files.length > 0 && (
              <ul>
                {files.map((file) => (
                  <li key={`${file.name}-${file.size}`}>{file.name}</li>
                ))}
              </ul>
            )}
            {sentCount !== null && (
              <p className="portal__sent">
                {portalCopy.sent} {sentCount} attached.
              </p>
            )}
            {error && <p className="portal__error">{error}</p>}
            <div className="portal__actions">
              <Button disabled={busy} type="submit" variant="dark">
                {busy ? portalCopy.sending : portalCopy.send}
              </Button>
              <button className="text-button" onClick={signOut} type="button">
                {portalCopy.signOut}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  )
}
