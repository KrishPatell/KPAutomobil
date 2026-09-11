import { useEffect, useState } from "react";
import KpButton from "../../components/KpButton";
import { Link } from "react-router-dom";
import { bookFlow } from "../../content/bookFlow";
import { pricing } from "../../content/pricing";
import { clear, emptyState, STEPS } from "../../lib/bookingFlow";
import { send } from "../../lib/booking";
import { takeDeposit, type DepositResult } from "../../lib/payments";
import { PHOTO_SLOTS } from "../../lib/photos";
import type { StepProps } from "./BookFlow";

/**
 * Step 7. It asks for the deposit and then does not take it, because there is no payment account
 * to take it into — and it says so in those words rather than showing a card field that posts
 * nowhere. `takeDeposit()` in src/lib/payments.ts is the one function that changes when Stripe
 * exists; this component already branches on its result.
 */
export default function StepDeposit({ state, set, goTo }: StepProps) {
  const [deposit, setDeposit] = useState<DepositResult | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [delivered, setDelivered] = useState(false);

  useEffect(() => {
    let live = true;
    takeDeposit().then((result) => live && setDeposit(result));
    return () => {
      live = false;
    };
  }, []);

  async function submit() {
    setStatus("sending");
    const files = PHOTO_SLOTS.map((slot) => state.photos[slot.id]?.file).filter(
      (file): file is File => Boolean(file),
    );
    const sent = await send(
      {
        name: state.name,
        phone: state.phone,
        email: state.email,
        size: state.size ?? "",
        service: state.service ?? "",
        date: state.date,
        window: state.window,
        notes: [state.notes, state.addOns.length ? `Add-ons: ${state.addOns.join(", ")}` : ""]
          .filter(Boolean)
          .join("\n"),
      },
      files,
    );
    setDelivered(sent);
    setStatus("done");
  }

  if (status === "done") {
    return (
      <section className="kp-step">
        <div className="kp-step__done" role="status">
          <h1 className="kp-step__heading">
            {delivered ? bookFlow.deposit.sentTitle : bookFlow.deposit.savedTitle}
          </h1>
          <p className="kp-step__lede">
            {delivered ? bookFlow.deposit.sentBody : bookFlow.deposit.savedBody}
          </p>
          {!delivered && <p className="kp-step__note">{bookFlow.deposit.pendingNote}</p>}
          <div className="kp-step__actions">
            <Link className="kp-step__back" to="/">
              {bookFlow.backToSite}
            </Link>
            <KpButton
              onClick={() => {
                clear();
                set({ ...emptyState });
                setStatus("idle");
                goTo(STEPS[0].slug);
              }}
              size="md"
            >
              {bookFlow.deposit.startAgain}
            </KpButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="kp-step">
      <h1 className="kp-step__heading">{bookFlow.deposit.heading}</h1>
      <p className="kp-step__lede">{bookFlow.deposit.lede}</p>

      <div className="kp-deposit">
        <p className="kp-deposit__figure">
          <span>{bookFlow.deposit.amountLabel}</span>
          <b>${pricing.deposit}</b>
        </p>
        {deposit?.status === "unavailable" && (
          <p className="kp-deposit__note">{deposit.reason}</p>
        )}
      </div>

      <div className="kp-step__actions">
        <button className="kp-step__back" onClick={() => goTo("quote")} type="button">
          {bookFlow.back}
        </button>
        <KpButton disabled={status === "sending"} onClick={submit} size="md">
          {status === "sending" ? bookFlow.deposit.sending : bookFlow.deposit.submit}
        </KpButton>
      </div>
    </section>
  );
}
