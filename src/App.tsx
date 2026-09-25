// The route table.
//
// Eight pages plus a 404, from src/content/nav.ts. /book/ is the exception to the shell: the IA is
// explicit that "nothing on this page should offer an exit before the deposit", so it renders its
// own reduced header and footer rather than the site nav.

import { useEffect, type ReactElement } from "react"
import { useRoute } from "./router"
import SiteNav from "./components/SiteNav"
import SiteFooter from "./components/SiteFooter"
import { pageFor } from "./content/nav"
import { site } from "./content/site"
import Home from "./pages/Home"
import Services from "./pages/Services"
import Gallery from "./pages/Gallery"
import About from "./pages/About"
import ServiceAreas from "./pages/ServiceAreas"
import Contact from "./pages/Contact"
import Faq from "./pages/Faq"
import BookingTerms from "./pages/BookingTerms"
import NotFound from "./pages/NotFound"
import QuotePrototype from "./pages/QuotePrototype"

/** Every page that renders inside the site shell, keyed by its normalised path. */
const routes: Record<string, () => ReactElement> = {
  "/": Home,
  "/services": Services,
  "/gallery": Gallery,
  "/about": About,
  "/service-areas": ServiceAreas,
  "/contact": Contact,
  "/faq": Faq,
  "/booking-terms": BookingTerms,
}

function useDocumentTitle(path: string) {
  useEffect(() => {
    const page = pageFor(path)
    document.title =
      page && page.href !== "/"
        ? `${page.title} · ${site.name}`
        : `${site.name} — ${site.tagline}`
  }, [path])
}

export default function App() {
  const { path } = useRoute()
  useDocumentTitle(path)

  // The previous multi-step quote flow is replaced by one connected request page.
  // Keep every older /book/* link valid by taking it to the same builder.
  if (path === "/book" || path.startsWith("/book/")) {
    return <QuotePrototype />
  }

  // Retained as a convenient local review URL.
  if (path === "/quote-prototype") {
    return <QuotePrototype />
  }

  const Page = routes[path] ?? NotFound

  return (
    <>
      <SiteNav />
      <main className="site-shell" id="top">
        <Page />
      </main>
      <SiteFooter />
    </>
  )
}
