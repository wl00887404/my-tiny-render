var Y = Object.defineProperty;
var Z = (t, o, s) => o in t ? Y(t, o, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[o] = s;
var d = (t, o, s) => (Z(t, typeof o != "symbol" ? o + "" : o, s), s);
const S = (t) => Array.from({ length: t }), k = (t, o) => S(t).map(() => S(o).map(() => 0)), u = (t) => [t.length, t[0].length], B = (t, o) => {
  const [s, e] = u(t), [c, n] = u(o);
  if (s !== c || e !== n)
    throw new Error(`M${s}x${e} can not add M${c}x${n}`);
  const r = k(s, e);
  for (let i = 0; i < s; i++)
    for (let a = 0; a < e; a++)
      r[i][a] = t[i][a] + o[i][a];
  return r;
}, D = (t, o) => {
  const [s, e] = u(t), [c, n] = u(o);
  if (s !== c || e !== n)
    throw new Error(`M${s}x${e} can not subtract M${c}x${n}`);
  const r = k(s, e);
  for (let i = 0; i < s; i++)
    for (let a = 0; a < e; a++)
      r[i][a] = t[i][a] - o[i][a];
  return r;
}, G = (t, o) => {
  const [s, e] = u(t), c = k(s, e);
  for (let n = 0; n < s; n++)
    for (let r = 0; r < e; r++)
      c[n][r] = t[n][r] * o;
  return c;
}, v = (t, o) => {
  const [s, e] = u(t), [c, n] = u(o);
  if (e !== c)
    throw new Error(`M${s}x${e} can not multiply M${c}x${n}`);
  const r = k(s, n);
  for (let i = 0; i < s; i++)
    for (let a = 0; a < n; a++)
      for (let f = 0; f < e; f++)
        r[i][a] += t[i][f] * o[f][a];
  return r;
}, H = (t) => {
  const [o, s] = u(t), e = k(s, o);
  for (let c = 0; c < o; c++)
    for (let n = 0; n < s; n++)
      e[n][c] = t[c][n];
  return e;
}, w = (...t) => {
  const o = t[t.length - 1];
  return t.slice(0, t.length - 1).reduceRight((s, e) => v(e, s), o);
}, M = {
  size: u,
  add: B,
  subtract: D,
  scale: G,
  multiply: v,
  transpose: H,
  compose: w
}, A = (t, o, s, e) => {
  const c = [[t], [o], [s]];
  return e !== void 0 && c.push([e]), c;
}, J = M.add, K = M.subtract, N = (t) => [t[0][0], t[1][0], t[2][0], t[3][0]], O = M.scale, Q = (t, o) => M.multiply(t, M.transpose(o))[0][0], U = (t) => Math.sqrt(Q(t, t)), I = (t) => {
  if (W(t))
    return O(t, 1 / U(t));
  const [o, s, e, c] = N(t);
  return A(o / c, s / c, e / c, 1);
}, W = (t) => t[3][0] === 0, h = {
  makeVector: A,
  normalize: I,
  add: J,
  subtract: K
}, _ = (t, o) => {
  const s = document.createElement("canvas");
  return s.width = t, s.height = o, s;
}, tt = (t, o, s) => {
  o.forEach((e) => {
    t.beginPath();
    const c = e.map((n) => {
      const r = I(M.multiply(s, n));
      return { x: r[0][0], y: r[1][0], z: r[2][0] };
    });
    t.moveTo(c[0].x, c[0].y), c.concat(c[0]).slice(1).forEach((n) => {
      t.lineTo(n.x, n.y);
    }), t.stroke();
  });
}, ot = (t, o, s) => [
  [1, 0, 0, t],
  [0, 1, 0, o],
  [0, 0, 1, s],
  [0, 0, 0, 1]
], C = (t) => [
  [t, 0, 0, 0],
  [0, t, 0, 0],
  [0, 0, t, 0],
  [0, 0, 0, 1]
], st = (t) => [
  [1, 0, 0, 0],
  [0, Math.cos(t), -Math.sin(t), 0],
  [0, Math.sin(t), Math.cos(t), 0],
  [0, 0, 0, 1]
], et = (t) => [
  [Math.cos(t), 0, Math.sin(t), 0],
  [0, 1, 0, 0],
  [-Math.sin(t), 0, Math.cos(t), 0],
  [0, 0, 0, 1]
], ct = (t) => [
  [Math.cos(t), -Math.sin(t), 0, 0],
  [Math.sin(t), Math.cos(t), 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
], nt = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 1]
], rt = (t, o) => [
  [t, 0, 0, 0],
  [0, t, 0, 0],
  [0, 0, t - o, t * o],
  [0, 0, 1, 0]
], at = (t, o, s) => {
  const e = t / (o * Math.tan(s) * 2), c = C(e);
  return c[1][1] *= -1, c;
}, it = (t, o) => [
  [1, 0, 0, t / 2],
  [0, -1, 0, o / 2],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
], y = h.makeVector(0, 0, Math.sqrt(3) * (2 / 3), 1), g = h.makeVector(1, 0, -Math.sqrt(3) / 3, 1), x = h.makeVector(-1, 0, -Math.sqrt(3) / 3, 1), $ = h.makeVector(0, Math.sqrt(8 / 3), 0, 1), lt = [
  [y, g, x],
  [y, g, $],
  [y, x, $],
  [g, x, $]
], V = h.makeVector(1, -1, 1, 1), b = h.makeVector(-1, -1, 1, 1), z = h.makeVector(-1, -1, -1, 1), P = h.makeVector(1, -1, -1, 1), q = h.makeVector(1, 1, 1, 1), j = h.makeVector(-1, 1, 1, 1), E = h.makeVector(-1, 1, -1, 1), T = h.makeVector(1, 1, -1, 1), ht = [
  [V, b, z, P],
  [q, j, E, T],
  [V, b, j, q],
  [P, z, E, T],
  [V, P, T, q],
  [b, z, E, j]
], ut = { tetrahedron: lt, cube: ht };
class ft {
  constructor() {
    d(this, "lastTimestamp");
    d(this, "callbacks", []);
    d(this, "stopFlag", !1);
    d(this, "update", (o) => {
      const s = this.lastTimestamp ? o - this.lastTimestamp : 0;
      this.callbacks.forEach((e) => e(s)), this.lastTimestamp = o, this.stopFlag || window.requestAnimationFrame(this.update);
    });
  }
  start() {
    this.stopFlag = !1, window.requestAnimationFrame(this.update);
  }
  stop() {
    this.stopFlag = !0;
  }
}
const pt = document.querySelector("#app"), Mt = () => {
  const c = Math.PI / 3;
  let n = 0, r = 0, i = 0;
  const a = 0.5, f = _(800, 450), m = {
    x: !1,
    y: !1,
    z: !1,
    shift: !1
  };
  pt.append(f);
  const L = w(
    it(800, 450),
    at(450, -10, c),
    nt,
    rt(-10, -50)
  ), F = f.getContext("2d"), R = new ft();
  window.onkeydown = (p) => {
    const l = p.key.toLowerCase();
    l !== "x" && l !== "y" && l !== "z" && l != "shift" || (m[l] = !0);
  }, window.onkeyup = (p) => {
    const l = p.key.toLowerCase();
    l !== "x" && l !== "y" && l !== "z" && l != "shift" || (m[l] = !1);
  }, R.callbacks.push((p) => {
    const l = m.shift ? -1 : 1;
    m.x ? n += a * (Math.PI / 180) * l * p : m.y ? r += a * (Math.PI / 180) * l * p : m.z && (i += a * (Math.PI / 180) * l * p);
    const X = w(
      ot(0, 0, -20),
      ct(i),
      et(r),
      st(n),
      C(8)
    );
    F.clearRect(0, 0, 800, 450), tt(F, ut.cube, w(L, X));
  }), R.start();
};
export {
  Mt as default
};
