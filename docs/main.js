var ct = Object.defineProperty;
var nt = (t, o, e) => o in t ? ct(t, o, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[o] = e;
var z = (t, o, e) => (nt(t, typeof o != "symbol" ? o + "" : o, e), e);
const U = (t) => Array.from({ length: t }), V = (t, o, e = 0) => U(t).map(() => U(o).map(() => e)), k = (t) => [t.length, t[0].length], rt = (t, o) => {
  const [e, c] = k(t), [s, n] = k(o);
  if (e !== s || c !== n)
    throw new Error(`M${e}x${c} can not add M${s}x${n}`);
  const a = V(e, c);
  for (let r = 0; r < e; r++)
    for (let i = 0; i < c; i++)
      a[r][i] = t[r][i] + o[r][i];
  return a;
}, at = (t, o) => {
  const [e, c] = k(t), [s, n] = k(o);
  if (e !== s || c !== n)
    throw new Error(`M${e}x${c} can not subtract M${s}x${n}`);
  const a = V(e, c);
  for (let r = 0; r < e; r++)
    for (let i = 0; i < c; i++)
      a[r][i] = t[r][i] - o[r][i];
  return a;
}, it = (t, o) => {
  const [e, c] = k(t), s = V(e, c);
  for (let n = 0; n < e; n++)
    for (let a = 0; a < c; a++)
      s[n][a] = t[n][a] * o;
  return s;
}, X = (t, o) => {
  const [e, c] = k(t), [s, n] = k(o);
  if (c !== s)
    throw new Error(`M${e}x${c} can not multiply M${s}x${n}`);
  const a = V(e, n);
  for (let r = 0; r < e; r++)
    for (let i = 0; i < n; i++)
      for (let u = 0; u < c; u++)
        a[r][i] += t[r][u] * o[u][i];
  return a;
}, lt = (t) => {
  const [o, e] = k(t), c = V(e, o);
  for (let s = 0; s < o; s++)
    for (let n = 0; n < e; n++)
      c[n][s] = t[s][n];
  return c;
}, w = (...t) => {
  const o = t[t.length - 1];
  return t.slice(0, t.length - 1).reduceRight((e, c) => X(c, e), o);
}, x = {
  makeMatrix: V,
  size: k,
  add: rt,
  subtract: at,
  scale: it,
  multiply: X,
  transpose: lt,
  compose: w
}, L = (t, o, e, c) => {
  const s = [[t], [o], [e]];
  return c !== void 0 && s.push([c]), s;
}, ht = x.add, ut = x.subtract, b = (t) => [t[0][0], t[1][0], t[2][0], t[3][0]], Y = x.scale, D = (t, o) => {
  const [e, c, s] = b(t), [n, a, r] = b(o);
  return e * n + c * a + s * r;
}, ft = (t, o) => {
  const [e, c, s] = b(t), [n, a, r] = b(o);
  return L(c * r - s * a, s * n - e * r, e * a - c * n, 1);
}, G = (t) => Math.sqrt(D(t, t)), pt = (t) => {
  if (H(t))
    return Y(t, 1 / G(t));
  const [o, e, c, s] = b(t);
  return L(o / s, e / s, c / s, 1);
}, mt = (t) => t[3][0] !== 0, H = (t) => t[3][0] === 0, l = {
  makeVector: L,
  normalize: pt,
  add: ht,
  subtract: ut,
  get: b,
  scale: Y,
  dot: D,
  cross: ft,
  length: G,
  isPoint: mt,
  isVector: H
}, J = (t, o) => {
  const e = document.createElement("canvas");
  return e.width = t, e.height = o, e;
}, dt = (t, o, e) => {
  o.forEach((c) => {
    t.beginPath();
    const s = c.points.map((a) => {
      const r = l.normalize(x.multiply(e, a));
      return l.get(r);
    }), n = s[s.length - 1];
    t.moveTo(n[0], n[1]), s.forEach((a) => {
      t.lineTo(a[0], a[1]);
    }), t.stroke();
  });
}, Mt = (t, o, e, c, s) => {
  const n = x.makeMatrix(c, s, -1 / 0);
  o.forEach((a) => {
    const r = a.points.map((i) => {
      const u = l.normalize(x.multiply(e, i));
      return l.get(u);
    });
    gt(t, r, a.color, n);
  });
}, gt = (t, o, e, c) => {
  for (let s = 0; s < o.length - 2; s++)
    kt(
      t,
      [o[0], o[s + 1], o[s + 2]],
      e,
      c
    );
}, kt = (t, o, e, c) => {
  let s = 1 / 0, n = 0, a = 0, r = 1 / 0;
  o.forEach((m) => {
    s = Math.min(s, m[1]), n = Math.max(n, m[0]), a = Math.max(a, m[1]), r = Math.min(r, m[0]);
  }), s = Math.floor(s), n = Math.ceil(n), a = Math.ceil(a), r = Math.floor(r);
  const [i, u, f] = o, p = l.makeVector(i[0], i[1], 0, 1), g = l.makeVector(u[0], u[1], 0, 1), d = l.makeVector(f[0], f[1], 0, 1), M = l.cross(
    l.subtract(g, p),
    l.subtract(d, p)
  ), h = l.length(M);
  for (let m = r; m < n; m++)
    for (let y = s; y < a; y++) {
      const P = wt(
        [m + 0.5, y + 0.5],
        p,
        g,
        d,
        h
      );
      if (!P)
        continue;
      const B = P[0] * o[0][2] + P[1] * o[1][2] + P[2] * o[2][2];
      if (c[m][y] > B)
        return;
      c[m][y] = B, t.fillStyle = e, t.fillRect(m, y, 1, 1);
    }
}, wt = (t, o, e, c, s) => {
  let n = 0;
  const a = l.makeVector(t[0], t[1], 0, 1), r = [e, c, o, e], i = [];
  for (let f = 0; f < 3; f++) {
    const p = l.subtract(r[f + 1], r[f]), g = l.subtract(a, r[f]), d = l.cross(p, g);
    i.push(d);
    const M = l.get(d)[2];
    n += M / Math.abs(M);
  }
  if (n === 3 || n === -3)
    return i.map((f) => l.length(f) / s);
}, K = (t, o, e) => [
  [1, 0, 0, t],
  [0, 1, 0, o],
  [0, 0, 1, e],
  [0, 0, 0, 1]
], Z = (t) => [
  [t, 0, 0, 0],
  [0, t, 0, 0],
  [0, 0, t, 0],
  [0, 0, 0, 1]
], N = (t) => [
  [1, 0, 0, 0],
  [0, Math.cos(t), -Math.sin(t), 0],
  [0, Math.sin(t), Math.cos(t), 0],
  [0, 0, 0, 1]
], O = (t) => [
  [Math.cos(t), 0, Math.sin(t), 0],
  [0, 1, 0, 0],
  [-Math.sin(t), 0, Math.cos(t), 0],
  [0, 0, 0, 1]
], Q = (t) => [
  [Math.cos(t), -Math.sin(t), 0, 0],
  [Math.sin(t), Math.cos(t), 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
], W = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
], _ = (t, o) => [
  [t, 0, 0, 0],
  [0, t, 0, 0],
  [0, 0, t - o, t * o],
  [0, 0, 1, 0]
], tt = (t, o, e) => {
  const c = t / (o * Math.tan(e) * 2), s = Z(c);
  return s[1][1] *= -1, s;
}, ot = (t, o) => [
  [1, 0, 0, t / 2],
  [0, -1, 0, o / 2],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
], $ = l.makeVector(0, 0, Math.sqrt(3) * (2 / 3), 1), I = l.makeVector(1, 0, -Math.sqrt(3) / 3, 1), C = l.makeVector(-1, 0, -Math.sqrt(3) / 3, 1), R = l.makeVector(0, Math.sqrt(8 / 3), 0, 1), yt = [
  { points: [$, I, C], color: "red" },
  { points: [$, I, R], color: "blue" },
  { points: [$, C, R], color: "green" },
  { points: [I, C, R], color: "yellow" }
], E = l.makeVector(1, -1, 1, 1), T = l.makeVector(-1, -1, 1, 1), q = l.makeVector(-1, -1, -1, 1), v = l.makeVector(1, -1, -1, 1), j = l.makeVector(1, 1, 1, 1), F = l.makeVector(-1, 1, 1, 1), S = l.makeVector(-1, 1, -1, 1), A = l.makeVector(1, 1, -1, 1), xt = [
  { points: [E, T, q, v], color: "red" },
  { points: [j, F, S, A], color: "red" },
  { points: [E, T, F, j], color: "blue" },
  { points: [v, q, S, A], color: "blue" },
  { points: [E, v, A, j], color: "green" },
  { points: [T, q, S, F], color: "green" }
], et = { tetrahedron: yt, cube: xt };
class bt {
  constructor() {
    z(this, "lastTimestamp");
    z(this, "callbacks", []);
    z(this, "stopFlag", !1);
    z(this, "update", (o) => {
      const e = this.lastTimestamp ? o - this.lastTimestamp : 0;
      this.callbacks.forEach((c) => c(e)), this.lastTimestamp = o, this.stopFlag || window.requestAnimationFrame(this.update);
    });
  }
  start() {
    this.stopFlag = !1, window.requestAnimationFrame(this.update);
  }
  stop() {
    this.stopFlag = !0;
  }
}
const st = document.querySelector("#app"), Vt = () => {
  const s = Math.PI / 3;
  let n = 0, a = 0, r = 0;
  const i = 0.5, u = J(800, 450), f = u.getContext("2d");
  st.append(u);
  const p = {
    x: !1,
    y: !1,
    z: !1,
    shift: !1
  };
  window.onkeydown = (M) => {
    const h = M.key.toLowerCase();
    h !== "x" && h !== "y" && h !== "z" && h != "shift" || (p[h] = !0);
  }, window.onkeyup = (M) => {
    const h = M.key.toLowerCase();
    h !== "x" && h !== "y" && h !== "z" && h != "shift" || (p[h] = !1);
  };
  const g = w(
    ot(800, 450),
    tt(450, -10, s),
    W,
    _(-10, -50)
  ), d = new bt();
  d.callbacks.push((M) => {
    const h = p.shift ? -1 : 1;
    p.x && (n += i * (Math.PI / 180) * h * M), p.y && (a += i * (Math.PI / 180) * h * M), p.z && (r += i * (Math.PI / 180) * h * M);
    const m = w(
      K(0, 0, -20),
      Q(r),
      O(a),
      N(n),
      Z(8)
    );
    f.clearRect(0, 0, 800, 450), dt(f, et.cube, w(g, m));
  }), d.start();
}, zt = () => {
  const s = Math.PI / 3;
  let n = 0, a = 0, r = 0;
  const i = J(800, 450), u = i.getContext("2d");
  st.append(i);
  const f = w(
    ot(800, 450),
    tt(450, -10, s),
    W,
    _(-10, -50)
  ), p = () => {
    console.time("drawCall");
    const g = w(
      K(0, 0, -20),
      Q(r),
      O(a),
      N(n),
      Z(8)
    );
    u.clearRect(0, 0, 800, 450), Mt(u, et.cube, w(f, g), 800, 450), console.timeEnd("drawCall");
  };
  p(), window.onkeydown = (g) => {
    const d = g.key.toLowerCase();
    d === "x" && (n += 30 * (Math.PI / 180)), d === "y" && (a += 30 * (Math.PI / 180)), d === "z" && (r += 30 * (Math.PI / 180)), p();
  };
}, $t = {
  stroke: Vt,
  fill: zt
};
export {
  $t as default
};
