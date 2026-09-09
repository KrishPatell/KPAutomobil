// The scrolling work rail on the homepage.
//
// These are captions describing what a detail covers, not customer quotes. There is no review,
// rating or star count anywhere in this file and none belongs here — KP Automobil is new and has
// none. When real reviews exist they get their own file and their own section.

import { media } from "./media"

export type WorkCard = {
  image: string
  title: string
  caption: string
}

export const workCards: WorkCard[] = [
  { image: media.blackSedan, title: "Hand Wax", caption: "Warm shine, buffed by hand" },
  { image: media.blueCoupe, title: "Driveway Finish", caption: "Ready before you leave" },
  { image: media.darkPickup, title: "Mobile Service", caption: "Everything travels in the van" },
  { image: media.whiteSuv, title: "SUV Detail", caption: "Paint, wheels, and glass finished" },
  { image: media.blackSedan, title: "Exterior Finish", caption: "A clean driveway-ready sedan" },
  { image: media.blueCoupe, title: "Full Detail", caption: "Paintwork and glass completed" },
  { image: media.darkPickup, title: "Truck Detail", caption: "A complete exterior reset" },
  { image: media.whiteSuv, title: "Driveway Detail", caption: "An on-site finish, front to back" },
  { image: media.blackSedan, title: "Sedan Finish", caption: "Careful work across every panel" },
  { image: media.blueCoupe, title: "Final Polish", caption: "A clear, even gloss" },
]
