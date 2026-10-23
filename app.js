// Paste a reel link. Known reels are pinned from KNOWN.
// A new reel is read from Instagram's public caption.

const NORTH = "https://www.instagram.com/reel/DbpLbAfJo8R/";
const STORAGE_KEY = "sydney-trip-v1";

const LEGS = [
  ["sydney", "pie", 46],
  ["pie", "oysters", 6],
  ["oysters", "alpacas", 50],
  ["alpacas", "jetty", 22],
];

const SEED = [
  place("sydney", "Sydney", -33.8688, 151.2093, 1, "Where you leave the city.", "The drive starts here and follows the arrows north. This pin is the departure, not a stop to fill the morning."),
  place("pie", "Pie in the Sky", -33.573946, 151.192394, 2, "Pies on the old highway at Cowan.", "1296 Pacific Highway, Cowan. First food stop on the reel, a pie shop sitting above the road a short way out of Sydney.", NORTH),
  place("oysters", "Oyster shed", -33.527758, 151.202806, 3, "Oysters on the Hawkesbury, a few minutes on.", "Hawkesbury River Oyster Shed, 6 Kowan Street, Mooney Mooney. The reel stops again because it is close and they wanted a meal by the river. Closed Monday and Tuesday.", NORTH),
  place("alpacas", "Alpacas", -33.258409, 151.381278, 4, "Alpacas inland at Jilliby.", "Iris Lodge Alpacas, 33 Dunks Lane, Jilliby. The animal stop. You turn off the highway and go inland. The water is the stop after this.", NORTH),
  place("jetty", "Long Jetty", -33.352692, 151.486102, 5, "The wharf at the end of the day.", "Long Jetty Wharf, on the Central Coast. The reel finishes here by the water and calls the day full without being rushed.", NORTH),
  place("train", "Tiny trains", -33.805167, 151.087477, null, "A miniature railway in West Ryde, off this route.", "Sydney Live Steam Locomotive Society, Anthony Road and Betts Street. Open to the public on the third Saturday, 1:30 to 4:30. Entry is $6 and a ride is $2.50.", "https://www.instagram.com/reel/DeL5ejquXSm/"),
];

const KNOWN = {
  DbpLbAfJo8R: SEED.filter((item) => item.url === NORTH),
  DeL5ejquXSm: [SEED.find((item) => item.id === "train")],
  DbcGx5Itp0G: [place("manon", "Manon, QVB", -33.8717, 151.2066, null, "Hot chocolate in the QVB.", "Chocolate chaud at Manon Brasserie, inside the Queen Victoria Building. A city treat, not part of the drive north.", "https://www.instagram.com/reel/DbcGx5Itp0G/")],
  Da7ZJdLyzYs: [place("bridge", "Harbour Bridge", -33.8523, 151.2108, null, "The walk across the bridge.", "The caption only says Sydney’s most famous walk and tags the harbour bridge. One walk, then you are done.", "https://www.instagram.com/reel/Da7ZJdLyzYs/")],
  Dauh5hhSHpo: [place("headland", "Harbour headland", -33.8516, 151.2464, null, "A headland walk in the harbour park.", "The caption does not name the park. A map of that same post points at Sydney Harbour National Park, around Bradleys Head. Watch the reel once to confirm.", "https://www.instagram.com/reel/Dauh5hhSHpo/")],
  DdGTgiqhzKv: [place("bikes", "Centennial Park", -33.897, 151.226, null, "A two-seater bike, then a picnic.", "Centennial Park Cycles. The reel suggests a 2-seater or a 4-seater, then time on the grass.", "https://www.instagram.com/reel/DdGTgiqhzKv/")],
  DbabTUKpQiV: [place("thredbo", "Thredbo", -36.5047, 148.305, null, "An alpine coaster, its own overnight.", "Thredbo Alpine Resort. Book ahead. Two adults can share a car. It is a long drive south, so it is not drawn on this map.", "https://www.instagram.com/reel/DbabTUKpQiV/")],
  DaPha9DsftQ: [place("concert", "Secret Garden", null, null, null, "A show in Sydney on 8 Nov 2026.", "The reel says to bring someone. The venue is not in the caption, so there is no pin.", "https://www.instagram.com/reel/DaPha9DsftQ/")],
  Dd7q4oZt6P7: [place("jet", "Hawkesbury jet car", null, null, null, "A jet-car tour on the Hawkesbury.", "The reel never names a dock, so it is not pinned. Take it on a day you are not doing the drive north.", "https://www.instagram.com/reel/Dd7q4oZt6P7/")],
  DeDjUurul6Z: [place("four", "Four day trips", null, null, null, "Four ideas, with no places named.", "The caption says there are four easy day trips from Sydney and does not name them. Open the reel and add the places yourself.", "https://www.instagram.com/reel/DeDjUurul6Z/")],
  Dddi4T5iqan: [place("slide", "Longest slide", null, null, null, "A slide, with no venue named.", "The caption says longest slide in Australia and does not say where. Open the reel before you travel.", "https://www.instagram.com/reel/Dddi4T5iqan/")],
};

const LAND = [
  [-33.98, 151.02], [-33.98, 151.27], [-33.9, 151.28], [-33.85, 151.29],
  [-33.83, 151.23], [-33.81, 151.29], [-33.7, 151.31], [-33.6, 151.33],
  [-33.57, 151.26], [-33.54, 151.33], [-33.45, 151.46], [-33.36, 151.52],
  [-33.3, 151.5], [-33.18, 151.52], [-33.18, 151.02],
];

const state = load();
let selectedId = "pie";

const urlInput = document.querySelector("#url");
const statusEl = document.querySelector("#status");

document.querySelector("#paste").addEventListener("submit", onPaste);
document.querySelector("#export").addEventListener("click", exportTrip);
document.querySelector("#import").addEventListener("change", importTrip);
document.querySelector("#reset").addEventListener("click", resetTrip);
document.querySelector("#map").addEventListener("click", onMapClick);
document.querySelector("#list").addEventListener("click", onListClick);

render();

async function onPaste(event) {
  event.preventDefault();
  const raw = urlInput.value.trim();
  const code = shortcode(raw);
  if (!code) {
    setStatus("Paste a reel link.");
    return;
  }

  const reelUrl = `https://www.instagram.com/reel/${code}/`;
  if (KNOWN[code]) {
    const known = KNOWN[code].map((item) => ({ ...item }));
    const renew = known.filter((item) => item.lat != null).length > 1;
    const added = adoptPlaces(known, renew);
    setStatus(added.length ? `Added ${added.map((item) => item.name).join(", ")}.` : "That reel is already on the map.");
    clearForm();
    render();
    return;
  }

  setStatus("Reading the reel…");
  let caption = "";
  try {
    caption = await readReel(code);
  } catch {
    setStatus("Instagram did not let this page read that reel. Links already saved in the trip still work.");
    return;
  }

  let found = placesFromCaption(caption, reelUrl);
  if (!found.length) {
    const unnamed = place("reel-" + code, "Untitled reel", null, null, null, "No place was written in the caption.", caption.slice(0, 280), reelUrl);
    adoptPlaces([unnamed], false);
    setStatus("The reel was read, but it did not name a place to pin.");
    clearForm();
    render();
    return;
  }

  setStatus(found.length > 1 ? "Placing those addresses…" : "Placing that address…");
  for (const item of found) {
    if (item.lat == null && item.query) {
      const point = await geocode(item.query);
      if (point) {
        item.lat = point.lat;
        item.lng = point.lng;
      }
    }
  }
  const renew = found.filter((item) => item.lat != null).length > 1;
  const added = adoptPlaces(found, renew);
  const located = added.filter((item) => item.lat != null).length;
  setStatus(located ? `Updated the map with ${added.map((item) => item.name).join(", ")}.` : "Saved the name. The address could not be placed on this map.");
  clearForm();
  render();
}

async function readReel(code) {
  const endpoint = "https://www.instagram.com/api/v1/oembed/?url=" + encodeURIComponent("https://www.instagram.com/reel/" + code + "/");
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("blocked");
  const data = await response.json();
  if (!data.title) throw new Error("empty");
  return data.title;
}

function placesFromCaption(caption, reelUrl) {
  const lines = caption.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const found = [];
  lines.forEach((line, index) => {
    const address = line.match(/\d{1,5}\s+.{3,60}?(?:Street|St|Road|Rd|Lane|Ln|Highway|Hwy|Avenue|Ave|Parade|Pde|Drive|Dr)\b.*/i);
    if (!address) return;
    const name = cleanName(lines[index - 1] || "") || cleanName(address[0]);
    found.push(place(slug(name), name, null, null, null, address[0], address[0], reelUrl, address[0]));
  });
  if (/long jetty wharf/i.test(caption) && !found.some((item) => /jetty/i.test(item.name))) {
    found.push(place("long-jetty", "Long Jetty Wharf", -33.352692, 151.486102, null, "Named in the caption.", "Long Jetty Wharf, from the caption.", reelUrl));
  }
  return found;
}

async function geocode(query) {
  const endpoint = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=au&q=" + encodeURIComponent(query);
  try {
    const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data[0] || !/australia/i.test(data[0].display_name || "")) return null;
    return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
  } catch {
    return null;
  }
}

function adoptPlaces(incoming, renew) {
  if (renew) state.places.forEach((item) => { item.order = null; });
  const added = [];
  incoming.forEach((item, index) => {
    const copy = { ...item };
    if (renew && copy.lat != null) copy.order = index + 1;
    const exists = state.places.find((saved) => saved.id === copy.id || (copy.url && saved.url === copy.url && saved.name === copy.name));
    if (exists) {
      if (renew) exists.order = copy.order;
      selectedId = exists.id;
      return;
    }
    state.places.push(copy);
    added.push(copy);
    selectedId = copy.id;
  });
  if (renew) syncLegs();
  save();
  return added;
}

function syncLegs() {
  const ordered = state.places.filter((item) => item.order != null && item.lat != null).sort((a, b) => a.order - b.order);
  const north = ["sydney", "pie", "oysters", "alpacas", "jetty"];
  const sameNorth = ordered.length === north.length && ordered.every((item, index) => item.id === north[index]);
  if (sameNorth) {
    state.legs = LEGS.map((leg) => [leg[0], leg[1], leg[2], "drive"]);
    return;
  }
  state.legs = [];
  for (let index = 0; index < ordered.length - 1; index += 1) {
    const km = Math.max(1, Math.round(haversine(ordered[index], ordered[index + 1])));
    state.legs.push([ordered[index].id, ordered[index + 1].id, km, "straight"]);
  }
}

function haversine(a, b) {
  const radius = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * radius * Math.asin(Math.min(1, Math.sqrt(h)));
}

function render() {
  document.querySelector("#map").innerHTML = drawMap();
  const legs = state.legs || [];
  const km = legs.reduce((sum, leg) => sum + leg[2], 0);
  const straight = legs.some((leg) => leg[3] === "straight");
  document.querySelector("#total").textContent = km
    ? (straight ? `About ${km} km in a straight line between the numbered stops.` : `${km} km of driving, one way.`)
    : "";
  const selected = state.places.find((item) => item.id === selectedId);
  const reelLink = document.querySelector("#reel-link");
  reelLink.innerHTML = selected && selected.url
    ? `<a href="${esc(selected.url)}">${esc(selected.url)}</a>`
    : "";
  const stops = [...state.places].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  document.querySelector("#list").innerHTML = stops.map((item) => {
    const selected = item.id === selectedId;
    const label = item.order ? `${item.order}. ${item.name}` : item.name;
    const text = selected ? item.about : item.line;
    const link = selected && item.url ? `<a href="${esc(item.url)}">Open in Instagram</a>` : "";
    return `<article class="place${selected ? " selected" : ""}">
      <button type="button" data-id="${esc(item.id)}"><strong>${esc(label)}</strong><p>${esc(text)}</p></button>
      ${link}
    </article>`;
  }).join("");
}

function drawMap() {
  const width = 400;
  const height = 520;
  const pad = 36;
  const pins = state.places.filter((item) => item.lat != null && item.lng != null);
  const outside = pins.some((item) => !inFrame(item));
  const bounds = outside ? boundsFor(pins) : { minLat: -33.98, maxLat: -33.18, minLng: 151.02, maxLng: 151.56 };
  const project = (lat, lng) => ({
    x: pad + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (width - pad * 2),
    y: pad + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (height - pad * 2),
  });
  const land = outside ? "" : `<path d="${LAND.map(([lat, lng]) => project(lat, lng)).map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ")} Z" fill="#f7f6f3" stroke="#c9c6bf"></path>`;
  const byId = Object.fromEntries(state.places.map((item) => [item.id, item]));
  const route = (state.legs || [])
    .map(([fromId, toId, km]) => ({ from: byId[fromId], to: byId[toId], km }))
    .filter((leg) => leg.from && leg.to && leg.from.lat != null && leg.to.lat != null);

  const arrows = route.map((leg, index) => {
    const arrow = segmentArrow(project(leg.from.lat, leg.from.lng), project(leg.to.lat, leg.to.lng));
    const label = distanceLabel(arrow, index);
    return `<line x1="${arrow.x1}" y1="${arrow.y1}" x2="${arrow.x2}" y2="${arrow.y2}" stroke="#1d4f8a" stroke-width="1.5"></line>
      <polygon points="${arrow.points}" fill="#1d4f8a"></polygon>
      <text x="${label.x}" y="${label.y}" text-anchor="middle" fill="#5e5c58" font-size="11">${leg.km} km</text>`;
  }).join("");

  const marks = pins.map((item) => {
    const point = project(item.lat, item.lng);
    const label = labelFor(item.id, point);
    const active = item.id === selectedId ? `<circle cx="${point.x}" cy="${point.y}" r="12" fill="none" stroke="#1d4f8a"></circle>` : "";
    const number = item.order ? `<text x="${point.x}" y="${point.y + 3}" text-anchor="middle" fill="#fff" font-size="10">${item.order}</text>` : "";
    return `<g data-id="${esc(item.id)}" class="map-hit">${active}
      <circle cx="${point.x}" cy="${point.y}" r="${item.order ? 8 : 5}" fill="${item.order ? "#1d4f8a" : "#8a877f"}"></circle>
      ${number}
      <text x="${label.x}" y="${label.y}" text-anchor="${label.anchor}" fill="#1c1c1c" font-size="11">${esc(item.name)}</text>
    </g>`;
  }).join("");

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Trip map">
    <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="#e3eaf1" stroke="#e4e1db"></rect>
    ${land}
    <text x="${width / 2}" y="18" text-anchor="middle" fill="#8a877f" font-size="11">N</text>
    ${arrows}${marks}
  </svg>`;
}

function boundsFor(pins) {
  const lats = pins.map((item) => item.lat);
  const lngs = pins.map((item) => item.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latPad = Math.max(0.15, (maxLat - minLat) * 0.35);
  const lngPad = Math.max(0.15, (maxLng - minLng) * 0.35);
  return { minLat: minLat - latPad, maxLat: maxLat + latPad, minLng: minLng - lngPad, maxLng: maxLng + lngPad };
}

function onMapClick(event) {
  const node = event.target.closest("[data-id]");
  if (!node) return;
  selectedId = node.dataset.id;
  render();
}

function onListClick(event) {
  const node = event.target.closest("button[data-id]");
  if (!node) return;
  selectedId = node.dataset.id;
  render();
}

function exportTrip() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "sydney-trip.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function importTrip(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      if (!data || !Array.isArray(data.places)) throw new Error("bad file");
      state.places = data.places;
      state.legs = Array.isArray(data.legs) ? data.legs : [];
      save();
      selectedId = state.places[0] ? state.places[0].id : "sydney";
      setStatus("Imported the trip onto this phone.");
      render();
    } catch {
      setStatus("That file is not a trip export.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function resetTrip() {
  state.places = SEED.map((item) => ({ ...item }));
  state.legs = LEGS.map((leg) => [leg[0], leg[1], leg[2], "drive"]);
  save();
  selectedId = "pie";
  setStatus("Back to the original drive.");
  render();
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "");
    if (saved && Array.isArray(saved.places) && saved.places.length) {
      if (!Array.isArray(saved.legs)) saved.legs = LEGS.map((leg) => [leg[0], leg[1], leg[2], "drive"]);
      return saved;
    }
  } catch { /* use the seed */ }
  return {
    places: SEED.map((item) => ({ ...item })),
    legs: LEGS.map((leg) => [leg[0], leg[1], leg[2], "drive"]),
  };
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function shortcode(value) {
  const match = String(value).match(/instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : "";
}

function cleanName(line) {
  return line.replace(/@[\w.]+/g, "").replace(/^[^A-Za-z0-9]+/, "").replace(/\s+/g, " ").trim();
}

function slug(value) {
  const base = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "place";
  return state.places.some((item) => item.id === base) ? `${base}-${Date.now()}` : base;
}

function place(id, name, lat, lng, order, line, about, url, query) {
  return { id, name, lat, lng, order, line, about, url: url || "", query: query || "" };
}

function inFrame(item) {
  return item.lat <= -33.18 && item.lat >= -33.98 && item.lng >= 151.02 && item.lng <= 151.56;
}

function segmentArrow(start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const gap = 16;
  const x2 = end.x - ux * (gap + 4);
  const y2 = end.y - uy * (gap + 4);
  const px = -uy;
  const py = ux;
  const bx = x2 - ux * 8;
  const by = y2 - uy * 8;
  return {
    x1: start.x + ux * gap,
    y1: start.y + uy * gap,
    x2,
    y2,
    points: `${x2},${y2} ${bx + px * 4},${by + py * 4} ${bx - px * 4},${by - py * 4}`,
  };
}

function distanceLabel(arrow, index) {
  const dx = arrow.x2 - arrow.x1;
  const dy = arrow.y2 - arrow.y1;
  const len = Math.hypot(dx, dy) || 1;
  const side = index === 1 ? -1 : 1;
  return {
    x: (arrow.x1 + arrow.x2) / 2 + (-dy / len) * 16 * side,
    y: (arrow.y1 + arrow.y2) / 2 + (dx / len) * 16 * side,
  };
}

function labelFor(id, point) {
  if (id === "pie" || id === "alpacas") return { x: point.x - 12, y: point.y + 4, anchor: "end" };
  if (id === "oysters" || id === "jetty") return { x: point.x + 12, y: point.y + 4, anchor: "start" };
  if (id === "train") return { x: point.x + 10, y: point.y - 10, anchor: "start" };
  return { x: point.x, y: point.y + 20, anchor: "middle" };
}

function clearForm() {
  urlInput.value = "";
}

function setStatus(message) {
  statusEl.textContent = message;
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}
