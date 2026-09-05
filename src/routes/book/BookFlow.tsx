import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import BrandMark from "../../components/BrandMark";
import {
  STEPS,
  canVisit,
  firstIncomplete,
  isPackageTitle,
  isSizeId,
  isStep,
  load,
  save,
  type FlowState,
  type StepSlug,
} from "../../lib/bookingFlow";
import { bookFlow } from "../../content/bookFlow";
import StepSize from "./StepSize";
import StepPackage from "./StepPackage";
import StepExtras from "./StepExtras";
import StepPhotos from "./StepPhotos";
import StepContact from "./StepContact";
import StepQuote from "./StepQuote";
import StepDeposit from "./StepDeposit";

export type StepProps = {
  state: FlowState;
  set: (patch: Partial<FlowState>) => void;
  next: () => void;
  goTo: (slug: StepSlug) => void;
};

/**
 * The instant-quote flow — the product, per docs/information-architecture.pdf. The marketing page
 * exists to feed this.
 *
 * The shell owns three things and delegates the rest: the state and its persistence, the guard
 * that stops anyone deep-linking past an unanswered question, and the ?size= / ?package= hand-off
 * the homepage uses so a visitor who has already picked a vehicle does not get asked twice.
 */
export default function BookFlow() {
  const params = useParams<{ step?: string }>();
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<FlowState>(load);

  // The query string is read once and then removed, so a Back button does not re-apply an answer
  // the visitor has since changed.
  useEffect(() => {
    const size = search.get("size");
    const pkg = search.get("package");
    if (!size && !pkg) return;
    setState((prev) => ({
      ...prev,
      size: isSizeId(size) ? size : prev.size,
      service: isPackageTitle(pkg) ? pkg : prev.service,
    }));
    setSearch(new URLSearchParams(), { replace: true });
  }, [search, setSearch]);

  useEffect(() => {
    save(state);
  }, [state]);

  const step: StepSlug = isStep(params.step) ? params.step : "size";
  const index = STEPS.findIndex((entry) => entry.slug === step);

  // Guard. Runs after the query hand-off above, so ?size=suv lands on /book/package rather than
  // being bounced back to the size step it just answered.
  useEffect(() => {
    if (!isStep(params.step)) {
      navigate(`/book/${firstIncomplete(state)}`, { replace: true });
      return;
    }
    if (!canVisit(state, params.step)) {
      navigate(`/book/${firstIncomplete(state)}`, { replace: true });
    }
  }, [params.step, state, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  // Under 860px the step rail is a horizontal strip, so step 6 sits off the right edge and the
  // visitor sees a rail that looks stuck on step 1. Keep the current one in frame.
  const railRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const rail = railRef.current;
    const current = rail?.querySelector(".is-current");
    if (!rail || !current || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({
      left: (current as HTMLElement).offsetLeft - rail.clientWidth / 2 + (current as HTMLElement).offsetWidth / 2,
      behavior: "smooth",
    });
  }, [step]);

  const props: StepProps = useMemo(
    () => ({
      state,
      set: (patch) => setState((prev) => ({ ...prev, ...patch })),
      next: () => navigate(`/book/${STEPS[Math.min(index + 1, STEPS.length - 1)].slug}`),
      goTo: (slug) => navigate(`/book/${slug}`),
    }),
    [state, index, navigate],
  );

  return (
    <div className="kp-flow">
      <header className="kp-flow__bar">
        <Link className="kp-flow__brand" to="/">
          <BrandMark />
        </Link>
        <Link className="kp-flow__exit" to="/">
          {bookFlow.backToSite}
        </Link>
      </header>

      <div className="kp-flow__body">
        <nav aria-label="Booking steps" className="kp-flow__steps">
          <p className="kp-flow__count">{bookFlow.stepOf(index + 1, STEPS.length)}</p>
          <ol ref={railRef}>
            {STEPS.map((entry, i) => {
              const reachable = canVisit(state, entry.slug);
              return (
                <li
                  className={`kp-flow__step${i === index ? " is-current" : ""}${
                    i < index ? " is-done" : ""
                  }`}
                  key={entry.slug}
                >
                  <button
                    disabled={!reachable}
                    onClick={() => navigate(`/book/${entry.slug}`)}
                    type="button"
                  >
                    <span className="kp-flow__pip">{i + 1}</span>
                    {entry.label}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <main className="kp-flow__panel">
          {step === "size" && <StepSize {...props} />}
          {step === "package" && <StepPackage {...props} />}
          {step === "extras" && <StepExtras {...props} />}
          {step === "photos" && <StepPhotos {...props} />}
          {step === "contact" && <StepContact {...props} />}
          {step === "quote" && <StepQuote {...props} />}
          {step === "deposit" && <StepDeposit {...props} />}
        </main>
      </div>
    </div>
  );
}
