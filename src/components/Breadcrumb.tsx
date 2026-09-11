// "Home / Services & Pricing" — the IA puts one on every sub-page.

import { Link } from "../router"

export default function Breadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="crumb">
      <Link href="/">Home</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{title}</span>
    </nav>
  )
}
