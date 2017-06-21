var $jscomp = $jscomp || {}
$jscomp.scope = {}
$jscomp.owns = function (e, g) {
  return Object.prototype.hasOwnProperty.call(e, g)
}
$jscomp.ASSUME_ES5 = !1
$jscomp.ASSUME_NO_NATIVE_MAP = !1
$jscomp.ASSUME_NO_NATIVE_SET = !1
$jscomp.defineProperty = $jscomp.ASSUME_ES5 ||
  typeof Object.defineProperties === 'function'
  ? Object.defineProperty
  : function (e, g, p) {
    e != Array.prototype && e != Object.prototype && (e[g] = p.value)
  }
$jscomp.getGlobal = function (e) {
  return typeof window !== 'undefined' && window === e
    ? e
    : typeof global !== 'undefined' && global != null ? global : e
}
$jscomp.global = $jscomp.getGlobal(this)
$jscomp.polyfill = function (e, g, p, l) {
  if (g) {
    p = $jscomp.global
    e = e.split('.')
    for (l = 0; l < e.length - 1; l++) {
      var x = e[l]
      x in p || (p[x] = {})
      p = p[x]
    }
    e = e[e.length - 1]
    l = p[e]
    g = g(l)
    g != l &&
      g != null &&
      $jscomp.defineProperty(p, e, { configurable: !0, writable: !0, value: g })
  }
}
$jscomp.polyfill(
  'Object.assign',
  function (e) {
    return e || function (e, p) {
      for (var l = 1; l < arguments.length; l++) {
        var g = arguments[l]
        if (g) for (var y in g) $jscomp.owns(g, y) && (e[y] = g[y])
      }
      return e
    }
  },
  'es6-impl',
  'es3'
)
;(function () {
  function e (a) {
    return {
      el: a,
      getClass: function () {
        var a = this.el.getAttribute('class')
        return a || ''
      },
      getClasses: function () {
        var a = this.el.getAttribute('class')
        return a &&
          typeof a === 'string' &&
          ((a = a.replace(/^\s\s*/, '').replace(/\s\s*$/, '')), a !== '')
          ? a.split(' ')
          : []
      },
      prevAll: function () {
        return this.dir('previousSibling')
      },
      nextAll: function () {
        return this.dir('nextSibling')
      },
      parent: function () {
        var a = this.el.parentNode
        return a && a.nodeType !== 11 ? e(a) : null
      },
      dir: function (a) {
        for (var b = [], d = this.el[a]; d && d.nodeType !== 9;) { d.nodeType === 1 && b.push(e(d)), (d = d[a]) }
        return b
      }
    }
  }
  function g (a, b, c) {
    switch (c.length) {
      case 0:
        return a.call(b)
      case 1:
        return a.call(b, c[0])
      case 2:
        return a.call(b, c[0], c[1])
      case 3:
        return a.call(b, c[0], c[1], c[2])
    }
    return a.apply(b, c)
  }
  function p (a, b) {
    var c
    if ((c = !(!a || !a.length))) {
      a: if (b !== b) {
        b: {
          b = l
          c = a.length
          for (var d = -1; ++d < c;) {
            if (b(a[d], d, a)) {
              a = d
              break b
            }
          }
          a = -1
        }
      } else {
        c = -1
        for (d = a.length; ++c < d;) {
          if (a[c] === b) {
            a = c
            break a
          }
        }
        a = -1
      }
      c = a > -1
    }
    return c
  }
  function l (a) {
    return a !== a
  }
  function x (a, b) {
    return a.has(b)
  }
  function y (a) {
    var b = !1
    if (a != null && typeof a.toString !== 'function') {
      try {
        b = !!(a + '')
      } catch (c) {}
    }
    return b
  }
  function r (a) {
    var b = -1,
      c = a ? a.length : 0
    for (this.clear(); ++b < c;) {
      var d = a[b]
      this.set(d[0], d[1])
    }
  }
  function t (a) {
    var b = -1,
      c = a ? a.length : 0
    for (this.clear(); ++b < c;) {
      var d = a[b]
      this.set(d[0], d[1])
    }
  }
  function u (a) {
    var b = -1,
      c = a ? a.length : 0
    for (this.clear(); ++b < c;) {
      var d = a[b]
      this.set(d[0], d[1])
    }
  }
  function A (a) {
    var b = -1,
      c = a ? a.length : 0
    for (this.__data__ = new u(); ++b < c;) this.add(a[b])
  }
  function B (a, b) {
    for (var c = a.length; c--;) {
      var d = a[c][0]
      if (d === b || (d !== d && b !== b)) return c
    }
    return -1
  }
  function L (a, b, c, d, f) {
    var m = -1,
      h = a.length
    c || (c = Y)
    for (f || (f = []); ++m < h;) {
      var n = a[m]
      if (b > 0 && c(n)) {
        if (b > 1) L(n, b - 1, c, d, f)
        else {
          for (var e = f, k = -1, g = n.length, l = e.length; ++k < g;) { e[l + k] = n[k] }
        }
      } else d || (f[f.length] = n)
    }
    return f
  }
  function C (a, b) {
    a = a.__data__
    var c = typeof b === 'undefined' ? 'undefined' : v(b)
    return (c == 'string' || c == 'number' || c == 'symbol' || c == 'boolean'
      ? b !== '__proto__'
      : b === null)
      ? a[typeof b === 'string' ? 'string' : 'hash']
      : a.map
  }
  function M (a, b) {
    a = a == null ? void 0 : a[b]
    b = !N(a) || (O && O in a) ? !1 : (P(a) || y(a) ? Z : aa).test(ba(a))
    return b ? a : void 0
  }
  function Y (a) {
    var b
    ;(b = ca(a)) ||
      (b =
        F(a) &&
        D.call(a, 'callee') &&
        (!da.call(a, 'callee') || Q.call(a) == '[object Arguments]'))
    return b || !!(R && a && a[R])
  }
  function ba (a) {
    if (a != null) {
      try {
        return S.call(a)
      } catch (b) {}
      return a + ''
    }
    return ''
  }
  function F (a) {
    var b
    if (
      (b = !!a && (typeof a === 'undefined' ? 'undefined' : v(a)) == 'object')
    ) {
      if ((b = a != null)) {
        (b = a.length), (b =
          typeof b === 'number' && b > -1 && b % 1 == 0 && b <= 9007199254740991)
      }
      b = b && !P(a)
    }
    return b
  }
  function P (a) {
    a = N(a) ? Q.call(a) : ''
    return a == '[object Function]' || a == '[object GeneratorFunction]'
  }
  function N (a) {
    var b = typeof a === 'undefined' ? 'undefined' : v(a)
    return !!a && (b == 'object' || b == 'function')
  }
  function ea (a) {
    var b = a.getMethods()
    return {
      finished: function () {
        return b.length === 0
      },
      next: function (a, d, f, m, h, n) {
        return this.finished() ? !1 : b.shift()(a, d, f, m, h, n)
      }
    }
  }
  function T () {
    return U(
      {},
      fa,
      arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
    )
  }
  function V (a) {
    function b (a, b) {
      if (!0 === c.errorHandling) throw a
      typeof c.errorHandling === 'function' && c.errorHandling(a, b)
    }
    var c = arguments.length > 1 && void 0 !== arguments[1]
        ? arguments[1]
        : T(),
      d = arguments.length > 2 && void 0 !== arguments[2]
        ? arguments[2]
        : W(a, c.queryEngine),
      f = function h (a) {
        if (!a) {
          return b.call(
            h,
            Error('Simmer: No element was specified for parsing.'),
            a
          ), !1
        }
        for (
          var f = new ea(w), k = e(a), n = c.depth, g = [], l = 0;
          l < n && k !== null;
          l += 1
        ) { (g[l] = k), (k = g[l].parent()) }
        k = { stack: [], specificity: 0 }
        for (n = 0; n < g.length; n += 1) k.stack[n] = []
        for (; !f.finished() && !k.verified;) {
          try {
            ;(k = f.next(g, k, c, G, d, b)), k.specificity >=
              c.specificityThreshold &&
              !k.verified &&
              (k.verified = G(a, k, c.selectorMaxLength, d, b))
          } catch (ga) {
            b.call(h, ga, a)
          }
        }
        if (void 0 === k.verified || k.specificity < c.specificityThreshold) { k.verified = G(a, k, c.selectorMaxLength, d, b) }
        return k.verified
          ? k.verificationDepth ? H(k, k.verificationDepth) : H(k)
          : !1
      }
    f.configure = function () {
      var b = arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : a,
        d = T(
          U(
            {},
            c,
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
          )
        )
      return V(b, W(b, d.queryEngine), d)
    }
    return f
  }
  var ha = function (a) {
      return function (b, c) {
        try {
          return a.querySelectorAll(b)
        } catch (d) {
          c(d)
        }
      }
    },
    W = function (a, b) {
      a = a.document
      var c = typeof b === 'function' ? b : ha(a)
      return function (a, b) {
        return typeof a !== 'string' ? [] : c(a, b)
      }
    },
    q = typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
        ? global
        : typeof self !== 'undefined' ? self : {},
    v = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
      ? function (a) {
        return typeof a
      }
      : function (a) {
        return a &&
            typeof Symbol === 'function' &&
            a.constructor === Symbol &&
            a !== Symbol.prototype
          ? 'symbol'
          : typeof a
      },
    U =
      Object.assign ||
      function (a) {
        for (var b = 1; b < arguments.length; b++) {
          var c = arguments[b],
            d
          for (d in c) { Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]) }
        }
        return a
      },
    aa = /^\[object .+?Constructor\]$/,
    q = v(q) == 'object' && q && q.Object === Object && q,
    I =
      (typeof self === 'undefined' ? 'undefined' : v(self)) == 'object' &&
      self &&
      self.Object === Object &&
      self,
    q = q || I || Function('return this')(),
    I = Array.prototype,
    E = Function.prototype,
    J = Object.prototype,
    K = q['__core-js_shared__'],
    O = (function () {
      var a = /[^.]+$/.exec((K && K.keys && K.keys.IE_PROTO) || '')
      return a ? 'Symbol(src)_1.' + a : ''
    })(),
    S = E.toString,
    D = J.hasOwnProperty,
    Q = J.toString,
    Z = RegExp(
      '^' +
        S.call(D)
          .replace(/[\\^$.*+?()[\]{}|]/g, '\\$\x26')
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            '$1.*?'
          ) +
        '$'
    ),
    E = q.Symbol,
    da = J.propertyIsEnumerable,
    ia = I.splice,
    R = E ? E.isConcatSpreadable : void 0,
    X = Math.max,
    ja = M(q, 'Map'),
    z = M(Object, 'create')
  r.prototype.clear = function () {
    this.__data__ = z ? z(null) : {}
  }
  r.prototype['delete'] = function (a) {
    return this.has(a) && delete this.__data__[a]
  }
  r.prototype.get = function (a) {
    var b = this.__data__
    return z
      ? ((a = b[a]), a === '__lodash_hash_undefined__' ? void 0 : a)
      : D.call(b, a) ? b[a] : void 0
  }
  r.prototype.has = function (a) {
    var b = this.__data__
    return z ? void 0 !== b[a] : D.call(b, a)
  }
  r.prototype.set = function (a, b) {
    this.__data__[a] = z && void 0 === b ? '__lodash_hash_undefined__' : b
    return this
  }
  t.prototype.clear = function () {
    this.__data__ = []
  }
  t.prototype['delete'] = function (a) {
    var b = this.__data__
    a = B(b, a)
    if (a < 0) return !1
    a == b.length - 1 ? b.pop() : ia.call(b, a, 1)
    return !0
  }
  t.prototype.get = function (a) {
    var b = this.__data__
    a = B(b, a)
    return a < 0 ? void 0 : b[a][1]
  }
  t.prototype.has = function (a) {
    return B(this.__data__, a) > -1
  }
  t.prototype.set = function (a, b) {
    var c = this.__data__,
      d = B(c, a)
    d < 0 ? c.push([a, b]) : (c[d][1] = b)
    return this
  }
  u.prototype.clear = function () {
    this.__data__ = { hash: new r(), map: new (ja || t)(), string: new r() }
  }
  u.prototype['delete'] = function (a) {
    return C(this, a)['delete'](a)
  }
  u.prototype.get = function (a) {
    return C(this, a).get(a)
  }
  u.prototype.has = function (a) {
    return C(this, a).has(a)
  }
  u.prototype.set = function (a, b) {
    C(this, a).set(a, b)
    return this
  }
  A.prototype.add = A.prototype.push = function (a) {
    this.__data__.set(a, '__lodash_hash_undefined__')
    return this
  }
  A.prototype.has = function (a) {
    return this.__data__.has(a)
  }
  var ka = (function (a, b) {
      b = X(void 0 === b ? a.length - 1 : b, 0)
      return function () {
        for (
          var c = arguments, d = -1, f = X(c.length - b, 0), m = Array(f);
          ++d < f;

        ) { m[d] = c[b + d] }
        d = -1
        for (f = Array(b + 1); ++d < b;) f[d] = c[d]
        f[b] = m
        return g(a, this, f)
      }
    })(function (a, b) {
      if (F(a)) {
        b = L(b, 1, F, !0)
        var c = -1,
          d = p,
          f = !0,
          m = a.length,
          h = [],
          e = b.length
        if (m) {
          b: for (
            b.length >= 200 && ((d = x), (f = !1), (b = new A(b)));
            ++c < m;

          ) {
            var g = a[c],
              k = g,
              g = g !== 0 ? g : 0
            if (f && k === k) {
              for (var l = e; l--;) if (b[l] === k) continue b
              h.push(g)
            } else d(b, k, void 0) || h.push(g)
          }
        }
        a = h
      } else a = []
      return a
    }),
    ca = Array.isArray,
    w = {
      methods: [],
      getMethods: function () {
        return this.methods.slice(0)
      },
      addMethod: function (a, b) {
        b = b && (typeof b === 'undefined' ? 'undefined' : v(b)) === 'object'
          ? b
          : this
        this.methods.push(a.bind(b))
      },
      validationHelpers: {
        tagName: function (a) {
          return typeof a === 'string' && a.match(/^[a-zA-Z0-9]+$/gi) !== null
            ? a
            : !1
        },
        attr: function (a) {
          return typeof a === 'string' &&
            a.match(/^[0-9a-zA-Z][a-zA-Z_\-:0-9.]*$/gi) !== null
            ? a
            : !1
        },
        className: function (a) {
          return typeof a === 'string' &&
            a.match(/^\.?[a-zA-Z_\-:0-9]*$/gi) !== null
            ? a
            : !1
        }
      }
    }
  w.addMethod(function (a, b, c, d, f, m) {
    var h
    for (h = 0; h < a.length && !b.verified; h += 1) {
      var e = a[h]
      e = this.validationHelpers.attr(e.el.getAttribute('id'))
      var g
      if ((g = e)) g = (f('[id\x3d"' + e + '"]') || []).length === 1
      g &&
        (
          b.stack[h].push("[id\x3d'" + e + "']"),
          (b.specificity += 100),
          h === 0
            ? d(a[0], b, c.selectorMaxLength, f, m)
              ? (b.verified = !0)
              : (b.stack[h].pop(), (b.specificity -= 100))
            : b.specificity >= c.specificityThreshold &&
                d(a[0], b, c.selectorMaxLength, f, m) &&
                (b.verified = !0)
        )
    }
    return b
  })
  w.addMethod(function (a, b) {
    var c
    for (c = 0; c < a.length; c += 1) {
      var d = a[c]
      if ((d = this.validationHelpers.tagName(d.el.nodeName))) { b.stack[c].splice(0, 0, d), (b.specificity += 10) }
    }
    return b
  })
  w.addMethod(function (a, b, c, d, f, e) {
    var h = a[0]
    switch (h.el.nodeName) {
      case 'A':
        if ((h = h.el.getAttribute('href'))) { b.stack[0].push('A[href\x3d"' + h + '"]'), (b.specificity += 10) }
        break
      case 'IMG':
        if ((h = h.el.getAttribute('src'))) { b.stack[0].push('IMG[src\x3d"' + h + '"]'), (b.specificity += 10) }
        break
      default:
        return b
    }
    d(a[0], b, c.selectorMaxLength, f, e) ? (b.verified = !0) : b.stack[0].pop()
    return b
  })
  w.addMethod(function (a, b) {
    var c, d
    for (c = 0; c < a.length; c += 1) {
      var f = a[c]
      if (
        (f = f.el.getAttribute('class')) &&
        typeof f === 'string' &&
        (
          (f = f.replace(/^\s\s*/, '').replace(/\s\s*$/, '')),
          (d = f.match(/([^\s]+)/gi))
        )
      ) {
        d.length > 0 && (d[0] = '.' + d[0])
        d.length > 10 && d.splice(10, d.length - 10)
        for (f = 0; f < d.length; f += 1) { this.validationHelpers.className(d[f]) || d.splice(f, 1) }
        b.stack[c].push(d.join('.'))
        b.specificity += 10 * d.length
      }
    }
    return b
  })
  w.addMethod(
    function (a, b, c, d, f, e) {
      for (var h = 0, g, m; h < a.length && !b.verified;) {
        (g = a[h].prevAll()), (m = g.length + 1), (g = g.concat(
          a[h].nextAll()
        )), g.length !== 0 &&
          (
            (g = this.analyzeElementSiblings(a[h], g)),
            g ||
              (
                b.stack[h].push(':nth-child(' + m + ')'),
                (b.verified = d(a[0], b, c.selectorMaxLength, f, e))
              )
          ), (h += 1)
      }
      return b
    },
    {
      analyzeElementSiblings: function (a, b) {
        var c = a.el.nodeName,
          d = a.getClasses(),
          f = !0,
          e = d[0] instanceof Array && d[0].length > 0,
          g
        for (a = 0; a < b.length && (e || f); a += 1) {
          (e = b[a]), (g = e.el.nodeName) && g === c && (f = !1), (e =
            ka(d, e.getClasses()).length > 0)
        }
        return e || f
      }
    }
  )
  var H = function (a, b) {
      b = b || a.stack.length
      var c = [],
        d = 0,
        f
      for (f = b - 1; f >= 0; --f) {
        a.stack[f].length === 0
          ? f !== b - 1 - d ? c.push('*') : (d += 1)
          : c.push(a.stack[f].join(''))
      }
      return c.join(' \x3e ')
    },
    G = function (a, b, c, d, f) {
      for (var e = !1, g = 1; g <= b.stack.length && !e; g += 1) {
        e = H(b, g).trim()
        if (!e || !e.length || (c && e.length > c)) return !1
        e = d(e, f)
        if (
          (e = e.length === 1 && (void 0 !== a.el ? e[0] === a.el : e[0] === a))
        ) { b.verificationDepth = g }
      }
      return e
    },
    fa = {
      queryEngine: null,
      specificityThreshold: 100,
      depth: 3,
      errorHandling: !0,
      selectorMaxLength: 512
    }
  ;(function (a, b) {
    var c = a.Simmer
    a.Simmer = b
    b.noConflict = function () {
      a.Simmer = c
      return b
    }
  })(window, V(window))
})()
