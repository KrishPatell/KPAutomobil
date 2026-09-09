// Every image the site uses, imported once and named for what it shows.
//
// Vite fingerprints these at build time, so they have to be real imports rather than string paths.
// Collecting them here keeps forty-odd import lines out of the content files and gives each asset
// a name that says what it is instead of a hash.
//
// NOTE: this is reference photography. None of it is Kunj's own work yet. The pages that lean on
// it say so on screen — see `gallery.disclaimer` and the note on the results section. When the real
// shots arrive they replace the right-hand side of these bindings and nothing else changes.

import heroImage from "../imports/1440WLight/5a05f90c4323f8eb1048b55a1bf1ff72916c246a.png"
import aboutImage from "../imports/1440WLight/cc6887674c6325a2a57f60e235ccc8654e9fb30c.png"
import foamImage from "../imports/1440WLight/a22e277837b0a41985dd651f2b83233b102b1a98.png"
import beforeImage from "../imports/1440WLight/505593d73bde8af5bfbbd47b09c07cb19a8e5c0f.png"
import afterImage from "../imports/1440WLight/169c3269761df8accf364e4f8c82b4270a13dd5e.png"
import workInterior from "../imports/1440WLight/2c0b095cbd13138aaabd6eedbf692c1f026269a3.png"
import workDetail from "../imports/1440WLight/858ac59c533de617e6ed18ec8031fc4a07c0835f.png"
import workRestore from "../imports/1440WLight/f78d2e920428db1bee50f7f5e5e9b5a77fc99edb.png"
import sedanImage from "../imports/1440WLight/06431bf30dc9a56e4642cf6a55939156197d37aa.png"
import suvImage from "../imports/1440WLight/2deeea5f74e7f75c94ba2f5f0097e563fff8e707.png"
import truckImage from "../imports/1440WLight/5940b3a4d7f316436a734e6e92aff896f62d6511.png"
import electricImage from "../imports/1440WLight/7fa865e7fd869526c81f3f26770a2d81f6493244.png"
import coupeImage from "../imports/1440WLight/89602c4911c0560d7d092acf4303f8963ccfa99f.png"
import luxuryImage from "../imports/1440WLight/3d084481844e7e828f35bc278519f60f1da333c2.png"
import processImage from "../imports/1440WLight/e889eaaf6a46e055effc04767a7f673621364259.png"
import processQuoteImage from "../imports/1440WLight/19440e56c9c65186f3b6c30dec7f8a3ceeba185f.png"
import processArriveImage from "../imports/1440WLight/6d20032164c0accdcb808ea7f49eb357b1d69b6a.png"
import processDoneImage from "../imports/1440WLight/09a2840f1423e6f94915dc184d61277e4b149837.png"

import blackSedanReviewImage from "../assets/reviews/black-sedan-driveway.jpg"
import blueCoupeReviewImage from "../assets/reviews/blue-coupe-driveway.jpg"
import darkPickupReviewImage from "../assets/reviews/dark-pickup-driveway.jpg"
import whiteSuvReviewImage from "../assets/reviews/white-suv-driveway.jpg"
import foamWashImage from "../assets/reviews/foam-wash-mobile-service-v2.png"
import dirtyBmwDrivewayImage from "../assets/reviews/dirty-bmw-driveway-v2.png"

import handWaxImage from "../assets/booking/hand-wax-application.jpg"
import deepRestorationImage from "../assets/booking/deep-restoration-before.jpg"
import ceramicCoatingImage from "../assets/booking/ceramic-coating-application.jpg"
import threeRowCatalogImage from "../assets/booking/three-row-catalog-white-v3.jpg"
import minivanCatalogImage from "../assets/booking/minivan-catalog-white-v3.jpg"
import threeRowBookingImage from "../assets/booking/three-row-booking-black-v3.jpg"

import bmwFinishedImage from "../assets/results/bmw-3-series-finished.jpg"
import bmwHeavyDirtyImage from "../assets/results/bmw-heavy-dirty-v3.jpg"
import bmwMudImage from "../assets/results/bmw-3-series-mud-before.jpg"
import bmwPollenImage from "../assets/results/bmw-3-series-pollen-before.jpg"
import bmwRoadFilmImage from "../assets/results/bmw-3-series-road-film-before.jpg"
import bmwWaterSpotImage from "../assets/results/bmw-3-series-water-spot-before.jpg"
import bmwPaintHazeImage from "../assets/results/bmw-3-series-paint-haze-before.jpg"
import porscheCleanImage from "../assets/results/porsche-clean-v2.jpg"
import porscheHeavyDirtyImage from "../assets/results/porsche-heavy-dirty-v3.jpg"
import suvCleanImage from "../assets/results/suv-clean-v2.jpg"
import suvHeavyDirtyImage from "../assets/results/suv-heavy-dirty-v3.jpg"

import bmwCleanPromiseImage from "../assets/promise-bmw-clean-v3.png"
import bmwDirtyPromiseImage from "../assets/promise-bmw-dirty-v3.png"
import bmwFoamPromiseImage from "../assets/promise-bmw-foam-v3.png"
import fullDetailPorscheImage from "../assets/porsche-full-detail-user-v2.jpg"

export const media = {
  hero: heroImage,
  about: aboutImage,
  foam: foamImage,
  before: beforeImage,
  after: afterImage,

  workInterior,
  workDetail,
  workRestore,

  sedan: sedanImage,
  coupe: coupeImage,
  electric: electricImage,
  luxury: luxuryImage,
  suv: suvImage,
  truck: truckImage,
  threeRowCatalog: threeRowCatalogImage,
  threeRowBooking: threeRowBookingImage,
  minivanCatalog: minivanCatalogImage,

  process: processImage,
  processQuote: processQuoteImage,
  processArrive: processArriveImage,
  processDone: processDoneImage,

  blackSedan: blackSedanReviewImage,
  blueCoupe: blueCoupeReviewImage,
  darkPickup: darkPickupReviewImage,
  whiteSuv: whiteSuvReviewImage,
  foamWash: foamWashImage,
  dirtyBmwDriveway: dirtyBmwDrivewayImage,

  handWax: handWaxImage,
  deepRestoration: deepRestorationImage,
  ceramicCoating: ceramicCoatingImage,
  fullDetailPorsche: fullDetailPorscheImage,

  bmwFinished: bmwFinishedImage,
  bmwHeavyDirty: bmwHeavyDirtyImage,
  bmwMud: bmwMudImage,
  bmwPollen: bmwPollenImage,
  bmwRoadFilm: bmwRoadFilmImage,
  bmwWaterSpot: bmwWaterSpotImage,
  bmwPaintHaze: bmwPaintHazeImage,
  porscheClean: porscheCleanImage,
  porscheHeavyDirty: porscheHeavyDirtyImage,
  suvClean: suvCleanImage,
  suvHeavyDirty: suvHeavyDirtyImage,

  promiseDirty: bmwDirtyPromiseImage,
  promiseFoam: bmwFoamPromiseImage,
  promiseClean: bmwCleanPromiseImage,
}
