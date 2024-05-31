var I = Object.defineProperty;
var S = (t, o, e) => o in t ? I(t, o, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[o] = e;
var f = (t, o, e) => (S(t, typeof o != "symbol" ? o + "" : o, e), e);
const R = (t) => Array.from({ length: t }), M = (t, o) => R(t).map(() => R(o).map(() => 0)), h = (t) => [t.length, t[0].length], v = (t, o) => {
  const [e, s] = h(t), [c, n] = h(o);
  if (e !== c || s !== n)
    throw new Error(`M${e}x${s} can not add M${c}x${n}`);
  const r = M(e, s);
  for (let a = 0; a < e; a++)
    for (let i = 0; i < s; i++)
      r[a][i] = t[a][i] + o[a][i];
  return r;
}, K = (t, o) => {
  const [e, s] = h(t), [c, n] = h(o);
  if (e !== c || s !== n)
    throw new Error(`M${e}x${s} can not subtract M${c}x${n}`);
  const r = M(e, s);
  for (let a = 0; a < e; a++)
    for (let i = 0; i < s; i++)
      r[a][i] = t[a][i] - o[a][i];
  return r;
}, X = (t, o) => {
  const [e, s] = h(t), c = M(e, s);
  for (let n = 0; n < e; n++)
    for (let r = 0; r < s; r++)
      c[n][r] = t[n][r] * o;
  return c;
}, z = (t, o) => {
  const [e, s] = h(t), [c, n] = h(o);
  if (s !== c)
    throw new Error(`M${e}x${s} can not multiply M${c}x${n}`);
  const r = M(e, n);
  for (let a = 0; a < e; a++)
    for (let i = 0; i < n; i++)
      for (let u = 0; u < s; u++)
        r[a][i] += t[a][u] * o[u][i];
  return r;
}, Y = (t) => {
  const [o, e] = h(t), s = M(e, o);
  for (let c = 0; c < o; c++)
    for (let n = 0; n < e; n++)
      s[n][c] = t[c][n];
  return s;
}, k = (...t) => {
  const o = t[t.length - 1];
  return t.slice(0, t.length - 1).reduceRight((e, s) => z(s, e), o);
}, Z = {
  size: h,
  add: v,
  subtract: K,
  scale: X,
  multiply: z,
  transpose: Y,
  compose: k
}, _ = (t, o, e, s) => {
  const c = [[t], [o], [e]];
  return s !== void 0 && c.push([s]), c;
}, A = (t) => (t[3][0], [
  [t[0][0] / t[3][0]],
  [t[1][0] / t[3][0]],
  [t[2][0] / t[3][0]],
  [t[3][0] / t[3][0]]
]), l = {
  makeVector: _,
  normalize: A
}, B = (t, o) => {
  const e = document.createElement("canvas");
  return e.width = t, e.height = o, e;
}, D = (t, o, e) => {
  o.forEach((s) => {
    t.beginPath();
    const c = s.map((n) => {
      const r = A(Z.multiply(e, n));
      return { x: r[0][0], y: r[1][0], z: r[2][0] };
    });
    t.moveTo(c[0].x, c[0].y), c.concat(c[0]).slice(1).forEach((n) => {
      t.lineTo(n.x, n.y);
    }), t.stroke();
  });
}, G = (t, o, e) => [
  [1, 0, 0, t],
  [0, 1, 0, o],
  [0, 0, 1, e],
  [0, 0, 0, 1]
], C = (t) => [
  [t, 0, 0, 0],
  [0, t, 0, 0],
  [0, 0, t, 0],
  [0, 0, 0, 1]
], H = (t) => [
  [1, 0, 0, 0],
  [0, Math.cos(t), -Math.sin(t), 0],
  [0, Math.sin(t), Math.cos(t), 0],
  [0, 0, 0, 1]
], J = (t) => [
  [Math.cos(t), 0, Math.sin(t), 0],
  [0, 1, 0, 0],
  [-Math.sin(t), 0, Math.cos(t), 0],
  [0, 0, 0, 1]
], L = (t) => [
  [Math.cos(t), -Math.sin(t), 0, 0],
  [Math.sin(t), Math.cos(t), 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
], N = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 1]
], O = (t, o) => [
  [t, 0, 0, 0],
  [0, t, 0, 0],
  [0, 0, t - o, t * o],
  [0, 0, 1, 0]
], Q = (t, o, e) => {
  const s = t / (o * Math.tan(e) * 2), c = C(s);
  return c[1][1] *= -1, c;
}, U = (t, o) => [
  [1, 0, 0, t / 2],
  [0, -1, 0, o / 2],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
], d = l.makeVector(0, 0, Math.sqrt(3) * (2 / 3), 1), w = l.makeVector(1, 0, -Math.sqrt(3) / 3, 1), g = l.makeVector(-1, 0, -Math.sqrt(3) / 3, 1), y = l.makeVector(0, Math.sqrt(8 / 3), 0, 1), W = [
  [d, w, g],
  [d, w, y],
  [d, g, y],
  [w, g, y]
], V = l.makeVector(1, -1, 1, 1), $ = l.makeVector(-1, -1, 1, 1), x = l.makeVector(-1, -1, -1, 1), T = l.makeVector(1, -1, -1, 1), P = l.makeVector(1, 1, 1, 1), b = l.makeVector(-1, 1, 1, 1), j = l.makeVector(-1, 1, -1, 1), q = l.makeVector(1, 1, -1, 1), tt = [
  [V, $, x, T],
  [P, b, j, q],
  [V, $, b, P],
  [T, x, j, q],
  [V, T, q, P],
  [$, x, j, b]
], ot = { tetrahedron: W, cube: tt };
class et {
  constructor() {
    f(this, "lastTimestamp");
    f(this, "callbacks", []);
    f(this, "stopFlag", !1);
    f(this, "update", (o) => {
      const e = this.lastTimestamp ? o - this.lastTimestamp : 0;
      this.callbacks.forEach((s) => s(e)), this.lastTimestamp = o, this.stopFlag || window.requestAnimationFrame(this.update);
    });
  }
  start() {
    this.stopFlag = !1, window.requestAnimationFrame(this.update);
  }
  stop() {
    this.stopFlag = !0;
  }
}
const st = document.querySelector("#app"), nt = () => {
  const c = Math.PI / 3;
  let n = 0, r = 0, a = 0;
  const i = B(800, 450);
  st.append(i);
  const u = k(
    U(800, 450),
    Q(450, -10, c),
    N,
    O(-10, -50)
  ), E = i.getContext("2d"), F = new et();
  window.onkeydown = (m) => {
    const p = m.shiftKey ? -1 : 1;
    m.keyCode === 88 ? n += Math.PI / 180 * p : m.keyCode === 89 ? r += Math.PI / 180 * p : m.keyCode === 90 && (a += Math.PI / 180 * p);
  }, F.callbacks.push((m) => {
    const p = k(
      G(0, 0, -20),
      L(a),
      J(r),
      H(n),
      C(8)
    );
    E.clearRect(0, 0, 800, 450), D(E, ot.cube, k(u, p));
  }), F.start();
};
export {
  nt as default
};
