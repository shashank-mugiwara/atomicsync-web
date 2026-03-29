/**
 * Pre-compute particle positions for the human silhouette.
 * Run: node scripts/generate-silhouette-points.mjs > src/data/silhouette-particles.ts
 */

const VIEWBOX_W = 200;
const VIEWBOX_H = 500;

// Head approximated as polygon
const HEAD = [
  [100,28],[84,32],[74,44],[74,56],[74,68],[84,80],[100,84],
  [116,80],[126,68],[126,56],[126,44],[116,32],[100,28]
];

// Body outline simplified from SVG curves
const BODY = [
  [92,84],[92,98],[72,100],[52,108],[48,118],[44,120],
  [38,140],[36,164],[40,188],[42,200],[38,216],[34,232],
  [30,246],[28,254],[30,260],[34,266],[40,264],[42,258],
  [46,244],[48,228],[50,212],[52,196],[54,180],[56,164],
  [58,148],[60,136],[62,128],[64,148],[66,172],[68,196],
  [70,220],[70,236],[68,254],[66,272],[64,296],[62,320],
  [60,350],[58,380],[56,410],[56,430],[56,444],[54,454],
  [50,460],[46,468],[42,470],[40,470],[36,470],[34,466],
  [38,462],[42,458],[48,454],[52,448],[54,442],[56,436],
  [56,430],[58,408],[62,380],[66,350],[70,320],[76,296],
  [82,280],[92,264],[100,264],[108,264],[118,280],[124,296],
  [130,320],[134,350],[138,380],[142,408],[144,430],[144,436],
  [146,442],[150,448],[154,454],[160,458],[164,462],[168,466],
  [166,470],[162,470],[160,470],[156,468],[152,460],[148,454],
  [146,444],[146,430],[146,410],[144,380],[140,350],[136,320],
  [134,296],[132,272],[132,254],[130,236],[130,220],[132,196],
  [134,172],[136,148],[138,128],[140,136],[142,148],[144,164],
  [146,180],[148,196],[150,212],[152,228],[154,244],[158,258],
  [160,264],[166,266],[170,260],[172,254],[170,246],[166,232],
  [162,216],[158,200],[160,188],[164,164],[162,140],[156,120],
  [152,118],[148,108],[128,100],[108,98],[108,84],[92,84]
];

function pointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function isInside(x, y) {
  return pointInPolygon(x, y, HEAD) || pointInPolygon(x, y, BODY);
}

function poissonDiskSample(targetCount) {
  const area = VIEWBOX_W * VIEWBOX_H;
  const baseMin = Math.sqrt(area / (targetCount * Math.PI)) * 1.2;
  const k = 30;
  const density = (y) => {
    const t = y / VIEWBOX_H;
    return t < 0.4 ? 0.75 : t < 0.7 ? 1.0 : 1.25;
  };
  const cs = baseMin / Math.SQRT2;
  const gW = Math.ceil(VIEWBOX_W / cs);
  const gH = Math.ceil(VIEWBOX_H / cs);
  const grid = new Array(gW * gH).fill(null);
  const pts = [];
  const active = [];

  const gi = (x, y) => Math.floor(y / cs) * gW + Math.floor(x / cs);
  const add = (x, y) => { const i = pts.length; pts.push([x, y]); active.push(i); grid[gi(x, y)] = i; };
  const close = (x, y, md) => {
    const gx = Math.floor(x / cs), gy = Math.floor(y / cs);
    const sr = Math.ceil(md / cs);
    for (let dy = -sr; dy <= sr; dy++)
      for (let dx = -sr; dx <= sr; dx++) {
        const nx = gx+dx, ny = gy+dy;
        if (nx<0||ny<0||nx>=gW||ny>=gH) continue;
        const idx = grid[ny*gW+nx];
        if (idx===null) continue;
        const ddx=pts[idx][0]-x, ddy=pts[idx][1]-y;
        if (ddx*ddx+ddy*ddy < md*md) return true;
      }
    return false;
  };

  add(100, 200);
  let s = 0;
  while (active.length > 0 && s < targetCount * 20) {
    s++;
    const ri = Math.floor(Math.random() * active.length);
    const p = pts[active[ri]];
    const lm = baseMin * density(p[1]);
    let found = false;
    for (let i = 0; i < k; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = lm + Math.random() * lm;
      const nx = p[0] + Math.cos(a) * d;
      const ny = p[1] + Math.sin(a) * d;
      if (nx<0||ny<0||nx>=VIEWBOX_W||ny>=VIEWBOX_H) continue;
      if (!isInside(nx, ny)) continue;
      if (close(nx, ny, baseMin * density(ny))) continue;
      add(nx, ny); found = true; break;
    }
    if (!found) active.splice(ri, 1);
  }
  return pts;
}

function fillGaps(points) {
  const cs = 12;
  const cols = Math.ceil(VIEWBOX_W / cs);
  const rows = Math.ceil(VIEWBOX_H / cs);
  const occ = new Set();
  for (const p of points) occ.add(Math.floor(p[1]/cs)*cols + Math.floor(p[0]/cs));
  const result = [...points];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (occ.has(r*cols+c)) continue;
      const cx = (c+0.5)*cs, cy = (r+0.5)*cs;
      if (isInside(cx, cy)) result.push([cx, cy]);
    }
  return result;
}

function buildParticles(points) {
  const hx = VIEWBOX_W / 2, hy = VIEWBOX_H * 0.4;
  const maxD = Math.sqrt(VIEWBOX_W*VIEWBOX_W + VIEWBOX_H*VIEWBOX_H) / 2;
  return points.map(([px, py]) => {
    const d = Math.sqrt((px-hx)**2 + (py-hy)**2);
    const nd = Math.min(d / maxD, 1);
    const yr = py / VIEWBOX_H;
    const df = yr < 0.4 ? 0.3 : yr < 0.7 ? 0.6 : 1.0;
    return [
      +(px / VIEWBOX_W).toFixed(4),
      +(py / VIEWBOX_H).toFixed(4),
      +(1 + df * 4).toFixed(2),
      +(0.4 + Math.random() * 0.6).toFixed(2),
      +(1 - nd).toFixed(3),
      +nd.toFixed(3),
      +(Math.random() * Math.PI * 2).toFixed(3),
    ];
  });
}

console.error("Generating...");
const raw = poissonDiskSample(2000);
console.error(`Sampled: ${raw.length}`);
const filled = fillGaps(raw);
console.error(`Filled: ${filled.length}`);
const particles = buildParticles(filled);
console.error(`Final: ${particles.length} particles`);

// Output compact TypeScript — each particle is [tx, ty, size, opacity, colorPhase, arrivalOrder, breathPhase]
const out = [
  "// Auto-generated — do not edit. Run: node scripts/generate-silhouette-points.mjs > src/data/silhouette-particles.ts",
  "// Each tuple: [targetX, targetY, size, opacity, colorPhase, arrivalOrder, breathPhase]",
  "export type ParticleTuple = [number, number, number, number, number, number, number];",
  `export const PARTICLES: ParticleTuple[] = ${JSON.stringify(particles)};`,
];
process.stdout.write(out.join("\n") + "\n");
