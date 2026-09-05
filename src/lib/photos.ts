// The four-photo step: validation, a downscaled preview, and the upload seam.
//
// Nothing uploads yet — there is no bucket and no backend. `uploadPhotos` is the single function
// that changes when there is one; everything above it already treats the result as "may not have
// been delivered" so the UI never claims a photo was sent when it was only held in the tab.

/** Two outside, two inside — the four shots the brief says a written price needs. */
export const PHOTO_SLOTS = [
  { id: "front", label: "Front three-quarter", hint: "Stand at a corner so one side and the front are both in frame." },
  { id: "rear", label: "Rear three-quarter", hint: "The opposite corner, so between the two you have all four sides." },
  { id: "cabin", label: "Front cabin", hint: "Driver's door open, seats and carpet visible." },
  { id: "back-seat", label: "Rear seats or boot", hint: "Wherever the mess actually is — that is what sets the time." },
] as const;

export type PhotoSlotId = (typeof PHOTO_SLOTS)[number]["id"];

export type PhotoEntry = {
  /** A small JPEG data URL. Small enough to survive sessionStorage; not what gets uploaded. */
  preview: string;
  name: string;
  /** Bytes of the original file. */
  size: number;
  /**
   * The original file, when it is still in memory. Null after a page reload — the preview
   * survives, the blob does not, so the UI asks for it again rather than uploading a thumbnail.
   */
  file: File | null;
};

export const MAX_BYTES = 12 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export function validate(file: File): string | null {
  if (file.size > MAX_BYTES) return "That photo is over 12MB. A normal phone shot is well under.";
  if (file.type && !ACCEPTED.includes(file.type)) return "That is not an image file.";
  return null;
}

/** Draws the file into a canvas at most `edge` px on its long side and returns a JPEG data URL. */
export async function preview(file: File, edge = 420): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("decode failed"));
      el.src = url;
    });
    const scale = Math.min(1, edge / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.72);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Sends the four originals. Returns false when they could not be delivered, which is every time
 * until there is somewhere to send them.
 */
export async function uploadPhotos(_files: File[]): Promise<boolean> {
  return false;
}
