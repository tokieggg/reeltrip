const PLACES = [
  { id: "sydney", name: "Sydney", lat: -33.8688, lng: 151.2093, order: 1 },
  { id: "pie", name: "Pie in the Sky", lat: -33.573946, lng: 151.192394, order: 2 },
  { id: "oysters", name: "Oyster shed", lat: -33.527758, lng: 151.202806, order: 3 },
  { id: "alpacas", name: "Alpacas", lat: -33.258409, lng: 151.381278, order: 4 },
  { id: "jetty", name: "Long Jetty", lat: -33.352692, lng: 151.486102, order: 5 },
  { id: "bridge", name: "Harbour Bridge", lat: -33.8523, lng: 151.2108 },
  { id: "manon", name: "Manon", lat: -33.8717, lng: 151.2066 },
  { id: "headland", name: "Headland", lat: -33.8516, lng: 151.2464 },
  { id: "park", name: "Centennial Park", lat: -33.897, lng: 151.226 },
  { id: "train", name: "Tiny trains", lat: -33.805167, lng: 151.087477 },
];

const LEGS = [
  ["sydney", "pie", 46],
  ["pie", "oysters", 6],
  ["oysters", "alpacas", 50],
  ["alpacas", "jetty", 22],
];

const LAND = [
  [-33.98, 151.02], [-33.98, 151.27], [-33.9, 151.28], [-33.85, 151.29],
  [-33.83, 151.23], [-33.81, 151.29], [-33.7, 151.31], [-33.6, 151.33],
  [-33.57, 151.26], [-33.54, 151.33], [-33.45, 151.46], [-33.36, 151.52],
  [-33.3, 151.5], [-33.18, 151.52], [-33.18, 151.02],
];

const width = 400;
const height = 520;
const pad = 36;
const minLat = -33.98;
const maxLat = -33.18;
const minLng = 151.02;
const maxLng = 151.56;

const project = (lat, lng) => ({
  x: pad + ((lng - minLng) / (maxLng - minLng)) * (width - pad * 2),
  y: pad + ((maxLat - lat) / (maxLat - minLat)) * (height - pad * 2),
});

const byId = Object.fromEntries(PLACES.map((item) => [item.id, item]));
const land = LAND.map(([lat, lng]) => project(lat, lng));
const landPath = land.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ") + " Z";

const arrows = LEGS.map(([fromId, toId, km], index) => {
  const arrow = segmentArrow(project(byId[fromId].lat, byId[fromId].lng), project(byId[toId].lat, byId[toId].lng));
  const label = distanceLabel(arrow, index);
  return `<line x1="${arrow.x1}" y1="${arrow.y1}" x2="${arrow.x2}" y2="${arrow.y2}" stroke="#1d4f8a" stroke-width="1.5"></line>
    <polygon points="${arrow.points}" fill="#1d4f8a"></polygon>
    <text x="${label.x.toFixed(1)}" y="${label.y.toFixed(1)}" text-anchor="middle" fill="#5e5c58" font-size="11">${km} km</text>`;
}).join("");

const pins = PLACES.map((item) => {
  const point = project(item.lat, item.lng);
  const label = labelFor(item.id, point);
  const number = item.order ? `<text x="${point.x.toFixed(1)}" y="${(point.y + 3).toFixed(1)}" text-anchor="middle" fill="#fff" font-size="10">${item.order}</text>` : "";
  return `<g>
    <circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${item.order ? 8 : 5}" fill="${item.order ? "#1d4f8a" : "#8a877f"}"></circle>
    ${number}
    <text x="${label.x.toFixed(1)}" y="${label.y.toFixed(1)}" text-anchor="${label.anchor}" fill="#1c1c1c" font-size="11">${item.name}</text>
  </g>`;
}).join("");

document.querySelector("#map").innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Map of the Sydney week. Numbered arrows are Saturday's drive north.">
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="#e3eaf1" stroke="#e4e1db"></rect>
  <path d="${landPath}" fill="#f7f6f3" stroke="#c9c6bf"></path>
  <text x="${width / 2}" y="18" text-anchor="middle" fill="#8a877f" font-size="11">N</text>
  ${arrows}${pins}
</svg>`;

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
    points: `${x2.toFixed(1)},${y2.toFixed(1)} ${(bx + px * 4).toFixed(1)},${(by + py * 4).toFixed(1)} ${(bx - px * 4).toFixed(1)},${(by - py * 4).toFixed(1)}`,
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
  if (id === "oysters" || id === "jetty" || id === "headland") return { x: point.x + 12, y: point.y + 4, anchor: "start" };
  if (id === "train" || id === "bridge") return { x: point.x - 10, y: point.y - 8, anchor: "end" };
  if (id === "manon") return { x: point.x - 12, y: point.y + 16, anchor: "end" };
  if (id === "park") return { x: point.x + 10, y: point.y + 14, anchor: "start" };
  return { x: point.x, y: point.y + 20, anchor: "middle" };
}
