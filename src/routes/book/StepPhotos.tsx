import { useRef, useState } from "react";
import KpButton from "../../components/KpButton";
import { bookFlow } from "../../content/bookFlow";
import { PHOTO_SLOTS, preview, validate, type PhotoSlotId } from "../../lib/photos";
import type { StepProps } from "./BookFlow";

/**
 * Step 4, and the one the whole model rests on: four photos are what let KP write a price without
 * a site visit. Each slot is its own input so a visitor cannot upload four shots of the same
 * bumper and wonder why the quote is wrong.
 *
 * A slot with a thumbnail but no `file` is one that survived a page reload — see
 * src/lib/bookingFlow.ts. It renders as "attach again" rather than silently uploading a 420px
 * JPEG in place of the original.
 */
export default function StepPhotos({ state, set, next, goTo }: StepProps) {
  const inputs = useRef<Partial<Record<PhotoSlotId, HTMLInputElement | null>>>({});
  const [errors, setErrors] = useState<Partial<Record<PhotoSlotId, string>>>({});

  async function accept(id: PhotoSlotId, file: File | undefined) {
    if (!file) return;
    const problem = validate(file);
    if (problem) {
      setErrors((prev) => ({ ...prev, [id]: problem }));
      return;
    }
    setErrors((prev) => ({ ...prev, [id]: undefined }));
    const thumb = await preview(file);
    set({
      photos: { ...state.photos, [id]: { preview: thumb, name: file.name, size: file.size, file } },
    });
  }

  function drop(id: PhotoSlotId) {
    const rest = { ...state.photos };
    delete rest[id];
    set({ photos: rest });
  }

  const added = PHOTO_SLOTS.filter((slot) => state.photos[slot.id]).length;
  const stale = PHOTO_SLOTS.some((slot) => state.photos[slot.id] && !state.photos[slot.id]?.file);

  return (
    <section className="kp-step">
      <h1 className="kp-step__heading">{bookFlow.photos.heading}</h1>
      <p className="kp-step__lede">{bookFlow.photos.lede}</p>
      {stale && <p className="kp-step__note">{bookFlow.photos.reattachNote}</p>}

      <ul className="kp-shots">
        {PHOTO_SLOTS.map((slot) => {
          const entry = state.photos[slot.id];
          const needsFile = Boolean(entry && !entry.file);
          return (
            <li className={`kp-shot${entry ? " is-filled" : ""}`} key={slot.id}>
              <div className="kp-shot__frame">
                {entry ? (
                  <img alt={slot.label} src={entry.preview} />
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2L9 5h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-9Z" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                )}
              </div>
              <div className="kp-shot__meta">
                <b>{slot.label}</b>
                <small>{slot.hint}</small>
                {errors[slot.id] && <em className="kp-shot__error">{errors[slot.id]}</em>}
                <div className="kp-shot__actions">
                  <button
                    className="kp-shot__pick"
                    onClick={() => inputs.current[slot.id]?.click()}
                    type="button"
                  >
                    {needsFile
                      ? bookFlow.photos.reattach
                      : entry
                        ? bookFlow.photos.replace
                        : bookFlow.photos.add}
                  </button>
                  {entry && (
                    <button className="kp-shot__drop" onClick={() => drop(slot.id)} type="button">
                      {bookFlow.photos.remove}
                    </button>
                  )}
                </div>
              </div>
              <input
                accept="image/*"
                hidden
                onChange={(event) => accept(slot.id, event.target.files?.[0])}
                ref={(el) => {
                  inputs.current[slot.id] = el;
                }}
                type="file"
              />
            </li>
          );
        })}
      </ul>

      <div className="kp-step__actions">
        <button className="kp-step__back" onClick={() => goTo("extras")} type="button">
          {bookFlow.back}
        </button>
        <span className="kp-step__counter">
          {bookFlow.photos.counter(added, PHOTO_SLOTS.length)}
        </span>
        <KpButton disabled={added < PHOTO_SLOTS.length} onClick={next} size="md">
          {bookFlow.next}
        </KpButton>
      </div>
    </section>
  );
}
