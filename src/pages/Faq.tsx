import { useState } from "react"
import PageHead from "../components/PageHead"
import { Eyebrow, Reveal } from "../components/primitives"
import { faq, faqs } from "../content/faqs"

export default function Faq() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <PageHead
        eyebrow={faq.eyebrow}
        heading={faq.heading}
        standfirst={faq.intro}
        title="Frequently Asked Questions"
        compact
      />
      <section className="section faq faq-page">
        <div className="faq-layout">
          <div className="faq-copy">
            <Reveal>
              <Eyebrow>Before you book</Eyebrow>
            </Reveal>
            <Reveal className="delay-1">
              <h2>Everything people ask first.</h2>
            </Reveal>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => (
              <Reveal
                className={`faq-row delay-${Math.min(index + 1, 4)}`}
                key={item.question}
              >
                <h3>
                  <button
                    aria-expanded={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    type="button"
                  >
                    <span>{item.question}</span>
                    <b>{openFaq === index ? "×" : "+"}</b>
                  </button>
                </h3>
                <div
                  className={
                    openFaq === index ? "faq-answer open" : "faq-answer"
                  }
                >
                  <p>{item.answer}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
