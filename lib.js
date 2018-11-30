/*
 Copyright (c) 2017 fiveko.com
 See the LICENSE file for copying permission.
*/
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function(b, a, c) {
  b != Array.prototype && b != Object.prototype && (b[a] = c.value)
};
$jscomp.getGlobal = function(b) {
  return "undefined" != typeof window && window === b ? b : "undefined" != typeof global && null != global ? global : b
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {};
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(b) {
  return $jscomp.SYMBOL_PREFIX + (b || "") + $jscomp.symbolCounter_++
};
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var b = $jscomp.global.Symbol.iterator;
  b || (b = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
  "function" != typeof Array.prototype[b] && $jscomp.defineProperty(Array.prototype, b, {
    configurable: !0,
    writable: !0,
    value: function() {
      return $jscomp.arrayIterator(this)
    }
  });
  $jscomp.initSymbolIterator = function() {}
};
$jscomp.arrayIterator = function(b) {
  var a = 0;
  return $jscomp.iteratorPrototype(function() {
    return a < b.length ? {
      done: !1,
      value: b[a++]
    } : {
      done: !0
    }
  })
};
$jscomp.iteratorPrototype = function(b) {
  $jscomp.initSymbolIterator();
  b = {
    next: b
  };
  b[$jscomp.global.Symbol.iterator] = function() {
    return this
  };
  return b
};
$jscomp.polyfill = function(b, a, c, e) {
  if (a) {
    c = $jscomp.global;
    b = b.split(".");
    for (e = 0; e < b.length - 1; e++) {
      var f = b[e];
      f in c || (c[f] = {});
      c = c[f]
    }
    b = b[b.length - 1];
    e = c[b];
    a = a(e);
    a != e && null != a && $jscomp.defineProperty(c, b, {
      configurable: !0,
      writable: !0,
      value: a
    })
  }
};
$jscomp.polyfill("Array.from", function(b) {
  return b ? b : function(a, c, e) {
    $jscomp.initSymbolIterator();
    c = null != c ? c : function(d) {
      return d
    };
    var b = [],
      d = a[Symbol.iterator];
    if ("function" == typeof d)
      for (a = d.call(a); !(d = a.next()).done;) b.push(c.call(e, d.value));
    else
      for (var d = a.length, g = 0; g < d; g++) b.push(c.call(e, a[g]));
    return b
  }
}, "es6-impl", "es3");

function FivekoGFX(b) {
  function a(d) {
    try {
      return d.getContext("webgl", {
        premultipliedAlpha: !1
      }) || d.getContext("experimental-webgl", {
        premultipliedAlpha: !1
      })
    } catch (g) {
      console.log("ERROR: %o", g)
    }
    return null
  }

  function c(d, c) {
    var a = new XMLHttpRequest;
    a.open("GET", d, !1);
    a.onreadystatechange = function() {
      4 !== a.readyState || 200 !== a.status && 0 != a.status || c(a.responseText);
      return c("")
    };
    a.send(null)
  }

  function e(d) {
    var c = d.createTexture();
    d.bindTexture(d.TEXTURE_2D, c);
    d.getExtension("OES_texture_float");
    d.pixelStorei(d.UNPACK_FLIP_Y_WEBGL,
      !0);
    d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MIN_FILTER, d.NEAREST);
    d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MAG_FILTER, d.NEAREST);
    d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_S, d.CLAMP_TO_EDGE);
    d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_T, d.CLAMP_TO_EDGE);
    return c
  }

  function f(d, c, a) {
    var e = d.getAttribLocation(c, "a_position"),
      b = d.getUniformLocation(c, "u_image");
    c = d.getUniformLocation(c, "u_textureSize");
    d.vertexAttribPointer(e, 2, d.FLOAT, !1, 0, 0);
    d.enableVertexAttribArray(e);
    var e = d.canvas.width,
      g = d.canvas.height;
    d.bindFramebuffer(d.FRAMEBUFFER, a);
    d.uniform2f(c, e, g);
    d.uniform1i(b, 0);
    d.viewport(0, 0, e, g);
    d.drawArrays(d.TRIANGLES, 0, 6)
  }
  this.gl = b ? a(b) : a(document.createElement("canvas"));
  this.params = {};
  this.programs = {};
  this.sources = {};
  FivekoGFX.prototype.createProgram = function(d, c, a) {
    function e(d, c) {
      var a = b.createShader(d);
      b.shaderSource(a, c);
      b.compileShader(a);
      return b.getShaderParameter(a, b.COMPILE_STATUS) ? a : (alert("An error occurred compiling the shaders: " + b.getShaderInfoLog(a)), null)
    }
    var b = this.gl,
      g = this.programs[d];
    if (g) return g;
    a = a ? e(b.VERTEX_SHADER, a) : e(b.VERTEX_SHADER, "attribute vec2 a_position;                     \r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvoid main() { gl_Position = vec4(a_position, 0.0, 1.0); }");
    c = e(b.FRAGMENT_SHADER, c);
    g = b.createProgram();
    b.attachShader(g, a);
    b.attachShader(g, c);
    b.linkProgram(g);
    b.getProgramParameter(g, b.LINK_STATUS) ? this.programs[d] = g : alert("Unable to initialize the shader program.");
    return g
  };
  FivekoGFX.prototype.createProgramFromFile = function(d, a, e, b) {
    c(a, function(c) {
      "" !== c ?
        (c = createProgram(d, c), b(c)) : b(null)
    })
  };
  FivekoGFX.prototype.deleteProgram = function(d) {
    var c = this.gl,
      a = this.programs[d];
    a && (c.deleteProgram(a), this.programs[d] = null)
  };
  FivekoGFX.prototype.initialize = function(d, c) {
    var a = this.gl,
      b = a.canvas;
    if (!this.originalImageTexture || b.width != d || b.height != c) {
      b.width = d;
      b.height = c;
      this.originalImageTexture = e(a);
      for (var g = [], f = [], k = 0; 2 > k; ++k) {
        var h = e(a);
        g.push(h);
        a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, b.width, b.height, 0, a.RGBA, a.FLOAT, null);
        var n = a.createFramebuffer();
        f.push(n);
        a.bindFramebuffer(a.FRAMEBUFFER, n);
        a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, h, 0)
      }
      b = a.createBuffer();
      a.bindBuffer(a.ARRAY_BUFFER, b);
      a.bufferData(a.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), a.STATIC_DRAW);
      this.textures = g;
      this.framebuffers = f;
      this.count = 0
    }
  };
  FivekoGFX.prototype.load = function(a) {
    var c = this.gl;
    this.initialize(a.width, a.height);
    var d = window.performance.now();
    c.bindTexture(c.TEXTURE_2D, this.originalImageTexture);
    c.texImage2D(c.TEXTURE_2D, 0,
      c.RGBA, c.RGBA, c.UNSIGNED_BYTE, a);
    console.log("Image loaded!Elapsed: " + (window.performance.now() - d).toString())
  };
  FivekoGFX.prototype.renderto = function(a, c) {
    f(this.gl, a, c)
  };
  FivekoGFX.prototype.draw = function(a) {
    var c = this.gl,
      d = this.createProgram("draw", "precision mediump float;                                   \r\n\t\t\t\t\t\t\t\t\t\t\t\t\tuniform sampler2D u_image;                                  \r\n\t\t\t\t\t\t\t\t\t\t\t\t\tuniform vec2 u_textureSize;                                 \r\n\t\t\t\t\t\t\t\t\t\t\t\t\tvoid main() {                                               \r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;       \r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tgl_FragColor = texture2D(u_image, textCoord/*vec2(textCoord.x, 1.0 - textCoord.y)*/ );          \r\n\t\t\t\t\t\t\t\t\t\t\t\t\t}                                                           ");
    c.useProgram(d);
    f(c, d, null);
    this.count = 0;
    //a && a.getContext("2d").drawImage(c.canvas, 0, 0)
  };
  FivekoGFX.prototype.makeTextImage2D = function(a, c, b, e, f, m, k, h) {
    var d = this.gl,
      g = d.createTexture();
    d.activeTexture(d.TEXTURE0 + c);
    d.bindTexture(d.TEXTURE_2D, g);
    d.texParameteri(d.TEXTURE_2D, d.TEXTURE_MIN_FILTER, d.NEAREST);
    d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_S, d.CLAMP_TO_EDGE);
    d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_T, d.CLAMP_TO_EDGE);
    d.texImage2D(d.TEXTURE_2D, 0, m, e, f, 0, m, k, h);
    a = d.getUniformLocation(a, b);
    d.uniform1i(a, c);
    d.activeTexture(d.TEXTURE0)
  };
  FivekoGFX.prototype.readPixels = function(a) {
    var c = this.gl;
    a || (a = {
      data: new Uint8Array(c.canvas.width * c.canvas.height * 4),
      width: c.canvas.width,
      height: c.canvas.height
    });
    c.readPixels(0, 0, c.canvas.width, c.canvas.height, c.RGBA, c.UNSIGNED_BYTE, a.data);
    return a
  };
  FivekoGFX.prototype.getImageData = function(a, c, b, e) {
    var d = this.gl,
      f = new Float32Array(b * e * 4);
    d.readPixels(a, d.drawingBufferHeight - c - e, b, e, d.RGBA, d.FLOAT, f);
    return {
      data: f,
      width: b,
      height: e
    }
  };
  FivekoGFX.prototype.execute =
    function(a) {
      var c = this.gl;
      f(c, a, this.framebuffers[this.count % 2]);
      c.bindTexture(c.TEXTURE_2D, this.textures[this.count % 2]);
      ++this.count
    }
}
FivekoGFX.params = {};
FivekoGFX.sources = {};
FivekoGFX.sourceText = function(b, a) {
  return FivekoGFX.sources[b]
};
FivekoGFX.prototype.loadShaders = function(b) {
  function a(a, c) {
    var d = document.getElementById(c);
    if (!d) return null;
    var b = "",
      e = d.firstChild;
    for (console.log(a); e;) e.nodeType == e.TEXT_NODE && (b += e.textContent), e = e.nextSibling;
    if ("x-shader/x-fragment" == d.type) d = a.createShader(a.FRAGMENT_SHADER);
    else if ("x-shader/x-vertex" == d.type) d = a.createShader(a.VERTEX_SHADER);
    else return null;
    a.shaderSource(d, b);
    a.compileShader(d);
    return a.getShaderParameter(d, a.COMPILE_STATUS) ? d : (alert("An error occurred compiling the shaders: " +
      a.getShaderInfoLog(d)), null)
  }
  var c = this.gl,
    e = a(c, b[0]);
  b = a(c, b[1]);
  var f = c.createProgram();
  c.attachShader(f, b);
  c.attachShader(f, e);
  c.linkProgram(f);
  c.getProgramParameter(f, c.LINK_STATUS) || alert("Unable to initialize the shader program.");
  return f
};
(function(b) {
  function a(a) {
    var c = a.reduce(function(a, c) {
      return a + c
    }) || 1;
    return a.map(function(a) {
      return a / c
    })
  }
  b.prototype.conv2d = function(c) {
    var b = ~~Math.sqrt(c.length),
      d = this.gl,
      b = this.createProgram("conv2d_size_" + b, "\nprecision mediump float;\n\n#define KERNEL_SIZE %kernelSize%\n#define KERNEL_HALF KERNEL_SIZE / 2\n// our texture\nuniform sampler2D u_image;\nuniform float u_kernel[KERNEL_SIZE*KERNEL_SIZE];\nuniform vec2 u_textureSize;\n#define GET_PIXEL(_x, _y)   texture2D(u_image, textCoord + onePixel*vec2((_x), (_y)))\n#define imod(_x, _y)       int(mod(float(_x), float(_y)))\n\nvoid main() {\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\tvec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\n\tvec4 result = vec4(0.0);\n\tfor (int k = 0; k < KERNEL_SIZE*KERNEL_SIZE; k++)\n\t{\n\t\tresult += GET_PIXEL(imod(k, KERNEL_SIZE) - KERNEL_HALF, \n\t\t\t\t\t\t\tk / KERNEL_SIZE - KERNEL_HALF)*u_kernel[k];\n\t}\n\tgl_FragColor = vec4(result.rgb, 1.0);\n}".replace(/%kernelSize%/g,
        b));
    d.useProgram(b);
    var e = d.getUniformLocation(b, "u_kernel[0]");
    d.uniform1fv(e, a(c));
    this.execute(b)
  };
  var c = {
    ROWS: 1,
    COLS: 2,
    ALL: 3
  };
  b.prototype.conv1d = function(b, f) {
    var d = b.length + !(b.length & 1),
      e = this.gl,
      d = this.createProgram("conv1d_size_" + d, "\nprecision mediump float;\n\n#define KERNEL_SIZE %kernelSize%\n#define KERNEL_HALF KERNEL_SIZE / 2\n// our texture\nuniform sampler2D u_image;\nuniform float u_kernel[KERNEL_SIZE];\nuniform vec2 u_direction;\nuniform vec2 u_textureSize;\n\nvoid main() {\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\tvec2 onePixel = u_direction / u_textureSize;\n\tvec4 result = vec4(0.0);\n\tfor (int i = 0; i < KERNEL_SIZE; i++)\n\t{\n\t\tresult += texture2D(u_image, textCoord + onePixel*vec2(i - KERNEL_HALF))*u_kernel[i];\n\t}\n\tgl_FragColor = vec4(result.rgb, 1.0);\n}".replace(/%kernelSize%/g,
        d));
    e.useProgram(d);
    var p = e.getUniformLocation(d, "u_direction"),
      l = e.getUniformLocation(d, "u_kernel[0]");
    e.uniform1fv(l, a(b));
    f = f || c.ALL;
    f & c.COLS && (e.uniform2fv(p, [1, 0]), this.execute(d));
    f & c.ROWS && (e.uniform2fv(p, [0, 1]), this.execute(d))
  };
  b.CONV_TYPE = c
})(window.FivekoGFX);
(function(b) {
  b.prototype.nms = function(a) {
    var c = parseInt(a || 3) + !(a & 1);
    a = this.gl;
    c = this.createProgram("nms_size_" + c, "\nprecision mediump float;\n\n#define KERNEL_SIZE %kernelSize%\n\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nuniform vec2 u_direction;\n\n#define GET_PIXEL(_p) (texture2D(u_image, textCoord + onePixel*float(_p)))\n \n\nvoid main() {\n\tvec2 onePixel = u_direction / u_textureSize;\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\t\n\tif (any(lessThan(GET_PIXEL(0).rgb, vec3(0.0))))\n\t{\n\t\tgl_FragColor = vec4(vec3(0.0), 1.0);\n\t}\n\telse\n\t{\n\t\tint maxIdx;\n\t\tfloat maxValue = 0.0;\n\t\t\n\t\tfor (int i = -KERNEL_SIZE; i <= KERNEL_SIZE; i++)\n\t\t{\n\t\t\tfloat p = length(GET_PIXEL(i).rgb);\n\t\t\tif (p > maxValue)\n\t\t\t{\n\t\t\t\tmaxValue = p;\n\t\t\t\tmaxIdx = i;\n\t\t\t}\n\t\t}\n\t\tgl_FragColor = vec4(vec3(maxValue*(1.0 - float(maxIdx != 0)*2.0)), 1.0);\n\t}\n}".replace(/%kernelSize%/g,
      c));
    a.useProgram(c);
    var b = a.getUniformLocation(c, "u_direction");
    a.uniform2fv(b, [1, 0]);
    this.execute(c);
    a.uniform2fv(b, [0, 1]);
    this.execute(c)
  }
})(window.FivekoGFX);
(function(b) {
  b.prototype.gauss = function(a) {
    if (0 < a) {
      var c = this.params.gauss;
      if (!c || c.sigma !== a) {
        var c = Math.sqrt(2 * Math.PI) * a,
          b = 2 * a * a,
          f, d = new Float32Array(15);
        var g = 0;
        for (f = -7; 15 > g; f++, g++) d[g] = Math.exp(-(f * f) / b) / c;
        c = {
          sigma: a,
          kernel: d
        };
        this.params.gauss = c
      }
      this.conv1d(c.kernel)
    }
  }
})(window.FivekoGFX);
(function(b) {
  function a(a, b) {
    var c = a.gl,
      d = a.createProgram("sobel", "\nprecision mediump float;\n\n#define KERNEL_SIZE 3\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nuniform float u_kernel[KERNEL_SIZE];\n#define M_PI 3.1415926535897932384626433832795\n#define GET_PIXEL(_x, _y) (texture2D(u_image, textCoord + onePixel*vec2(_x, _y)))\n \n\nvoid main() {\n\tvec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\tfloat dx = (length(GET_PIXEL(-1, -1)*u_kernel[0] +\n\t\t\t\tGET_PIXEL(-1,  0)*u_kernel[1] +\n\t\t\t\tGET_PIXEL(-1, +1)*u_kernel[2]) -\n\t\t\t   length(GET_PIXEL(+1, -1)*u_kernel[0] +\n\t\t\t\tGET_PIXEL(+1,  0)*u_kernel[1] +\n\t\t\t\tGET_PIXEL(+1, +1)*u_kernel[2]));\n\tfloat dy = (length(GET_PIXEL(-1, -1)*u_kernel[0] +\n\t\t\t\tGET_PIXEL(0, -1)*u_kernel[1] +\n\t\t\t\tGET_PIXEL(+1, -1)*u_kernel[2]) -\n\t\t\t   length(GET_PIXEL(-1, +1)*u_kernel[0] +\n\t\t\t\tGET_PIXEL(0, +1)*u_kernel[1] +\n\t\t\t\tGET_PIXEL(+1, +1)*u_kernel[2]));\n\n///gl_FragColor = vec4(vec3(length(vec2(dx, dy))), 1.0);\n   float theta = (atan(dy, dx) + M_PI) / (2.0*M_PI);\n   gl_FragColor = vec4(length(vec2(dx, dy)), theta, 0.0, 1.0);\n}");
    c.useProgram(d);
    var e = c.getUniformLocation(d, "u_kernel[0]");
    c.uniform1fv(e, b);
    a.execute(d);
    c = a.gl;
    d = a.createProgram("edgeNMS", "\nprecision mediump float;\n\n#define KERNEL_SIZE 3\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\n#define M_PI 3.1415926535897932384626433832795\n\nvoid main() {\n\tvec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\tvec4 cc = texture2D(u_image, textCoord);   \n\tfloat theta = degrees(cc.y*M_PI*2.0); \n\tint ax = 0, ay = 0; \n\tif ((theta >= 337.5) || (theta < 22.5))       { ax = 1; ay = 0; }\n\telse if ((theta >= 22.5) && (theta < 67.5))   { ax = 1; ay = 1; }\n\telse if ((theta >= 67.5) && (theta < 112.5))  { ax = 0; ay = 1; }\n\telse if ((theta >= 112.5) && (theta < 157.5)) { ax =-1; ay = 1; }\n\telse if ((theta >= 157.5) && (theta < 202.5)) { ax =-1; ay = 0; }\n\telse if ((theta >=202.5) && (theta < 247.5))  { ax =-1; ay =-1; }\n\telse if ((theta >=247.5) && (theta < 292.5))  { ax = 0; ay =-1; }\n\telse if ((theta >= 292.5) && (theta < 337.5)) { ax = 1; ay =-1; }\n\n\tvec4 ca = texture2D(u_image, textCoord + onePixel*vec2(ax, ay));\n\tvec4 cb = texture2D(u_image, textCoord + onePixel*vec2(-ax, -ay));\n\tgl_FragColor = vec4((((cc.x <= ca.x) || (cc.x < cb.x)) ? vec3(0) : vec3(cc.x)), 1.0);\n}");
    c.useProgram(d);
    a.execute(d)
  }
  b.prototype.sobel = function() {
    a(this, [1, 2, 1])
  };
  b.prototype.schaar = function() {
    a(this, [3, 10, 3])
  }
})(window.FivekoGFX);
(function(b) {
  b.prototype.mean = function(a) {
    var c = parseInt(a) + !(a & 1);
    a = this.gl;
    c = this.createProgram("mean_size_" + c, "\nprecision mediump float;\n\n#define KERNEL_SIZE %kernelSize%\n#define KERNEL_HALF (KERNEL_SIZE / 2)\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nuniform vec2 u_direction;\n\nvoid main() {\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\tvec2 onePixel = u_direction / u_textureSize;\n\tvec4 meanColor = vec4(0.0);\n\tfor (int i = -KERNEL_HALF; i <= KERNEL_HALF; i++)\n\t{\n\t\tmeanColor += texture2D(u_image, textCoord + onePixel*vec2(i));\n\t}\n\tgl_FragColor = meanColor / float(KERNEL_SIZE);\n}".replace(/%kernelSize%/g,
      c));
    a.useProgram(c);
    var b = a.getUniformLocation(c, "u_direction");
    a.uniform2fv(b, [0, 1]);
    this.execute(c);
    a.uniform2fv(b, [1, 0]);
    this.execute(c)
  };
  b.prototype.blur = function(a) {
    a = ~~Math.min(12 * a * a / 8, 100);
    var c = this.gl,
      b = this.createProgram("blur3x3", "\nprecision mediump float;\n\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nvoid main() {\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\tvec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\n\tgl_FragColor = (\n\t\ttexture2D(u_image, textCoord + onePixel*vec2(-1.0, -1.0)) + \n\t\ttexture2D(u_image, textCoord + onePixel*vec2(0.0, -1.0)) + \n\t\ttexture2D(u_image, textCoord + onePixel*vec2(1.0, -1.0)) + \n\t\ttexture2D(u_image, textCoord + onePixel*vec2(-1.0, 0.0)) + \n\t\ttexture2D(u_image, textCoord + onePixel*vec2(0.0,  0.0)) + \n\t\ttexture2D(u_image, textCoord + onePixel*vec2(1.0,  0.0)) + \n\t\ttexture2D(u_image, textCoord + onePixel*vec2(-1.0, 1.0)) + \n\t\ttexture2D(u_image, textCoord + onePixel*vec2(0.0,  1.0)) + \n\t\ttexture2D(u_image, textCoord + onePixel*vec2(1.0,  1.0))) / 9.0;\n}");
    c.useProgram(b);
    for (c = 0; c < a; c++) this.execute(b)
  }
})(window.FivekoGFX);
(function(b) {
  b.prototype.symmetricnn = function(a, c) {
    var b = this.params.symmetricnn;
    b && b.size !== a && this.deleteProgram("symmetricnn");
    this.params.symmetricnn = {
      size: a
    };
    var f = this.gl,
      b = this.createProgram("symmetricnn", "\nprecision mediump float;\n\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nuniform int u_pixelsCount;\n#define KERNEL_SIZE %kernelSize%\n#define HALF_SIZE (KERNEL_SIZE / 2)\n\nvoid main() {\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\tvec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\n\tvec4 meanColor = vec4(0);\n\tvec4 v = texture2D(u_image, textCoord);\n\tint count = 0;\n\tfor (int y = 0; y <= HALF_SIZE; y++){\n\t\tfor (int x = -HALF_SIZE; x <= HALF_SIZE; x++){\n\t\t\tvec4 v1 = texture2D(u_image, textCoord + vec2(x, y) * onePixel);  \n\t\t\tvec4 v2 = texture2D(u_image, textCoord + vec2(-x, -y) * onePixel);\n\t\t\tvec4 d1 = abs(v - v1);\n\t\t\tvec4 d2 = abs(v - v2);\n\t\t\tvec4 rv = vec4(((d1[0] < d2[0]) ? v1[0] : v2[0]),\n\t\t\t\t\t\t\t((d1[1] < d2[1]) ? v1[1] : v2[1]),\n\t\t\t\t\t\t\t((d1[2] < d2[2]) ? v1[2] : v2[2]),1);\n\t\t\tmeanColor += rv;\n\t\t}\n\t}\n\tgl_FragColor = meanColor / float(u_pixelsCount);\n}".replace(/%kernelSize%/g,
        a));
    f.useProgram(b);
    var d = (a + !(a % 2)) * ((a + !(a % 2)) / 2 + .5),
      g = f.getUniformLocation(b, "u_pixelsCount");
    f.uniform1i(g, d);
    console.log("size:" + a + " count: " + d);
    for (f = 0; f < c; f++) this.execute(b)
  }
})(window.FivekoGFX);
(function(b) {
  b.prototype.houghCircle = function(a) {
    var c = this.gl,
      b = this.createProgram("houghCircle", "\nprecision mediump float;\n\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nuniform float u_r;\n#define M_PI 3.1415926535897932384626433832795\n#define PHI_STEP M_PI/180.0\n\nvoid main() {\n\tvec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\tvec4 sum = vec4(0.0);\n\tfloat phi = 0.0;\n\tfor (int i = 0; i < 360; i++)\n\t{\n\t\tphi += PHI_STEP;\n\t\tsum += texture2D(u_image, textCoord + onePixel*vec2(u_r*cos(phi), u_r*sin(phi)));\n\t}\n\t\n\tgl_FragColor = vec4(vec3(sum / 360.0), 1.0);\n}");
    c.useProgram(b);
    c.uniform1f(c.getUniformLocation(b, "u_r"), a);
    this.execute(b)
  }
})(window.FivekoGFX);
(function(b) {
  function a(a, b) {
    var c = this.gl,
      d = this.createProgram(a, b);
    c.useProgram(d);
    this.execute(d)
  }
  b.prototype.rgb2grey = function() {
    a.call(this, "rgb2grey", "\nprecision mediump float;\n\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nvec4 scale = vec4(0.299,  0.587,  0.114, 0.0);\nvoid main() {\n\tvec4 color = texture2D(u_image, gl_FragCoord.xy / u_textureSize);\n\tgl_FragColor = vec4(vec3(dot(color,scale)), color.a);\n}")
  };
  b.prototype.rgb2luma = function() {
    a.call(this, "rgb2lum",
      shaderSourceRGB2LUMA)
  };
  b.prototype.rgb2ycbcr = function() {
    a.call(this, "rgb2ycbcr", "\nprecision mediump float; \n\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize; \nmat4 scale =   mat4(0.257,  0.504,  0.098, 0.0, \n                   -0.148, -0.291,  0.439, 0.0, \n                    0.439, -0.368, -0.071, 0.0, \n                    1.0, 1.0,  1.0, 1.0 );\n\nvoid main() {\n\tvec4 color = texture2D(u_image, gl_FragCoord.xy / u_textureSize);\n\tgl_FragColor = color*scale + vec4(0.0625, 0.5, 0.5, 0);\n}")
  };
  b.prototype.ycbcr2rgb = function() {
    a.call(this, "ycbcr2rgb", "\nprecision mediump float;\n\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nmat4 scale =   mat4(1.164,  0.000,  1.596, 0.0,\n                    1.164, -0.392, -0.813, 0.0,\n                    1.164,  2.017,  0.000, 0.0,\n                    1.0, 1.0,  1.0, 1.0 );\n\nvoid main() {\n\tvec4 color = texture2D(u_image, gl_FragCoord.xy / u_textureSize);\n\tgl_FragColor = (color- vec4(0.0625, 0.5, 0.5, 0))*scale ;\n}")
  };
  b.prototype.skinMask = function() {
    var a = this.gl,
      b = this.createProgram("skinMask", "\nprecision mediump float;\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nvec4 thr = vec4(80.0/255.0, 120.0/255.0, 133.0/255.0, 173.0/255.0);\nvoid main() {\n\tvec4 color = texture2D(u_image, gl_FragCoord.xy / u_textureSize);\n\tgl_FragColor = vec4(vec3(( (color[0] > thr[0]) && \n\t\t\t\t(color[1] >= thr[0]) && (color[1] <= thr[1]) && \n\t\t\t\t(color[2] >= thr[2]) && (color[2] <=thr[3])) ? 1.0 : 0.0), \n\t\t\t\tcolor.a);\n}");
    this.rgb2ycbcr();
    a.useProgram(b);
    this.execute(b)
  };
  b.prototype.rgb2xyz = function() {
    a.call(this, "rgb2xyz", "\nprecision mediump float;\n\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\n#define SCALE(_c) (((_c) > 0.04045) ? (pow(((_c) + 0.055 ) / 1.055, 2.4)) : ((_c)/ 12.92))\nmat4 scale =   mat4(0.4124,  0.3576,  0.1805, 0.0, \n                    0.2126,  0.7152,  0.0722, 0.0, \n                    0.0193,  0.1192,  0.9505, 0.0, \n                    1.0, 1.0,  1.0, 1.0 );\nvoid main() {\n\tvec4 color = texture2D(u_image, gl_FragCoord.xy / u_textureSize);\n\tvec4 rgb = vec4(SCALE(color.r), SCALE(color.g), SCALE(color.b), color.a); \n\tgl_FragColor = rgb*scale;\n}")
  };
  b.prototype.rgb2hsl = function() {
    a.call(this, "rgb2hsl", "\nprecision mediump float;\n\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\n\nvoid main() {\n\tvec4 color = texture2D(u_image, gl_FragCoord.xy / u_textureSize);\n\tfloat cMin = min(min(color.r, color.g), color.b);\n\tfloat cMax = max(max(color.r, color.g), color.b);\n\tfloat L = (cMax + cMin)/(2.0);\n\t\n\tif (cMin == cMax){\n\t\tgl_FragColor = vec4(vec3(0, 0, L), color.a); \n\t\treturn;\n\t}\n\t// Calc Saturation\n\tfloat delta = (cMax - cMin);\n\tfloat S = ((L > 0.5) ? (delta / (2.0 - cMax - cMin)) : (delta / (cMax + cMin)));\n\t\n\t// Calc Hue\n\tfloat H = (color.r == cMax) ? (((color.g - color.b) / delta)) :\n\t\t\t\t((color.g == cMax) ? (2.0 + (color.b - color.r) / delta) :\n\t\t\t\t((4.0 + (color.r - color.g) / delta)));\n\tH = ((H < 0.0) ? (H + 6.0) : H) / 6.0;\n\tgl_FragColor = vec4(vec3(H, S, L), color.a);\n}")
  };
  b.prototype.colormap = function(a) {
    var c = this.gl,
      b = this.createProgram("colormap", "\nprecision mediump float;\n\n// our texture\nuniform vec2 u_textureSize;\nuniform sampler2D u_image;\nuniform sampler2D u_colorTable;\n\nvoid main() {\n\tvec2 pos = vec2(texture2D(u_image, gl_FragCoord.xy / u_textureSize).x, 0.0);\n\tvec4 color = texture2D(u_colorTable, pos);\n\t\n\tgl_FragColor = color;\n}");
    c.useProgram(b);
    this.makeTextImage2D(b, 1, "u_colorTable", a.length, 1, c.LUMINANCE, c.UNSIGNED_BYTE, a);
    this.execute(b)
  };
  b.prototype.rgb2bin = function(a) {
    var c = this.gl,
      b = this.createProgram("rgb2bin", "\nprecision mediump float;\n\n// our texture\nuniform vec2 u_textureSize;\nuniform sampler2D u_image;\nuniform vec4 u_threshold;\n\nvoid main() {\n\tvec4 color = texture2D(u_image, gl_FragCoord.xy / u_textureSize);\n\t\n\tgl_FragColor = vec4(greaterThan(color, u_threshold));\n}");
    c.useProgram(b);
    c.uniform4fv(c.getUniformLocation(b, "u_threshold"), a);
    this.execute(b)
  }
})(window.FivekoGFX);
(function(b) {
  function a(a, b) {
    function d(a, c) {
      return f[a + 1] - f[c + 1]
    }

    function e(a) {
      for (var c = 0; 4 > c; c++) {
        var b = a + m[c];
        if (0 === f[b]) {
          f[b] = f[a];
          var e = l[a + 0] + l[b + 0] >>> 1,
            g = l[a + 0] - l[b + 0],
            h = l[a + 1] - l[b + 1],
            k = l[a + 2] - l[b + 2];
          f[b + 1] = Math.sqrt(((512 + e) * g * g >> 8) + 4 * h * h + ((767 - e) * k * k >> 8));
          q.push(b, d)
        }
      }
    }
    for (var f = new a.data.constructor(new ArrayBuffer(a.data.length)), l = a.data, q = new c, m = [-4, 4, 4 * -a.width, 4 * a.width], k = 4 * a.width, h = 0, n = k * a.height; h < k; h += 4) f[h] = f[h + n] = 255;
    h = 0;
    for (n = a.height * k; h < n; h += k) f[h] = f[h + k - 1] = 255;
    h = 0;
    for (n =
           b.length; b[h]; h++)
      for (var n = b[h].pixels, r = 0, t = n.length; r < t; r++) f[n[r]] = 80 * (h + 1), e(n[r]);
    for (; !q.empty();) n = q.pop(), e(n);
    h = k + 4;
    for (n = k * a.height - k; h < n; h += 4) 160 == f[h] && (l[h + 1] = l[h + 2] = 255 * m.reduce(function(a, c) {
      return a | f[h] ^ f[h + c]
    }, 0))
  }
  var c = function() {
    this.nodes = []
  };
  c.prototype.push = function(a, c) {
    for (var b = this.nodes, e = 0, f = b.length; e < f;) {
      var l = e + f >>> 1;
      0 > c(a, b[l]) ? e = l + 1 : f = l
    }
    b.splice(e, 0, a)
  };
  c.prototype.pop = function() {
    return this.nodes.pop()
  };
  c.prototype.empty = function() {
    return 0 === this.nodes.length
  };
  c.prototype.size = function() {
    return this.nodes.length
  };
  b.prototype.watershed = function(c, b) {
    var d = c.getContext("2d"),
      e = d.getImageData(0, 0, c.width, c.height);
    a(e, b);
    d.putImageData(e, 0, 0)
  }
})(window.FivekoGFX);
(function(b) {
  b.prototype.histogram = function(a) {
    a = this.getImageData(a.x, a.y, a.w, a.h).data;
    for (var c = Array.from({
      length: 3
    }, function() {
      return new Uint32Array(256)
    }), b = 0, f = a.length; b < f; b += 4) c[0][~~(255 * a[b + 0])]++, c[1][~~(255 * a[b + 1])]++, c[2][~~(255 * a[b + 2])]++;
    return c
  };
  b.prototype.equalize = function(a) {
    var c = 0,
      b = 0;
    a = a.map(function(a) {
      b += a;
      c = c || b;
      return b
    });
    return Uint8Array.from(a, function(a) {
      return 0 < a ? 255 * (a - c) / (b - c) : 0
    })
  };
  b.prototype.normalize = function(a) {
    var c = Math.min.apply(null, a),
      b = Math.max.apply(null,
        a) - c || 1;
    return Uint8Array.from(a, function(a) {
      return 255 * (a - c) / b
    })
  }
})(window.FivekoGFX);
(function(b) {
  function a(a, b, f) {
    var c = this.gl;
    a = this.createProgram(a + b, "\nprecision mediump float;\n\n#define KERNEL_SIZE %kernelSize%\n#define KERNEL_HALF KERNEL_SIZE / 2\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nuniform vec2 u_direction;\n\n#define GET_PIXEL(_p) (texture2D(u_image, textCoord + onePixel*vec2(_p)))\n#define CMP  %cmpMethod%\n\nvoid main() {\n\tvec2 onePixel = u_direction / u_textureSize;\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\tvec4 resultColor = GET_PIXEL(0);\n\tfor (int i = -KERNEL_HALF; i <= KERNEL_HALF; i++){\n\t\tresultColor = CMP(resultColor, GET_PIXEL(i));\n\t}\n\tgl_FragColor = vec4(resultColor.rgb, 1.0);\n}".replace(/%kernelSize%/g,
      b).replace(/%cmpMethod%/g, f));
    c.useProgram(a);
    b = c.getUniformLocation(a, "u_direction");
    c.uniform2fv(b, [0, 1]);
    this.execute(a);
    c.uniform2fv(b, [1, 0]);
    this.execute(a)
  }
  b.prototype.erosion = function(b) {
    return a.call(this, "erosion", b || 3, "min")
  };
  b.prototype.dilation = function(b) {
    return a.call(this, "dilation", b || 3, "max")
  }
})(window.FivekoGFX);
(function(b) {
  b.prototype.logpolar = function() {
    var a = this.gl,
      b = this.createProgram("logpolar", "\nprecision mediump float;\n\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nconst float PI = atan(1.0, 0.0)*2.0;\nconst float PI_2 = 2.0*PI;\n#define IN_RANGE(v_) (((v_) >= 0.0) && ((v_) <= 1.0))\n\nvoid main() {\n\tvec2 p = gl_FragCoord.xy / u_textureSize;\n\tfloat radius = (exp(p.x) - 1.0)/1.718281828459045;\n\tfloat angle = PI + PI_2*p.y;\n\tvec2 polar = vec2(radius*cos(angle), radius*sin(angle)) + vec2(0.5);\n\tif (IN_RANGE(polar.x) && IN_RANGE(polar.y))\n\t\tgl_FragColor = texture2D(u_image, polar);\n\telse\n\t\tgl_FragColor = vec4(vec3(0.0), 1.0);\n}");
    a.useProgram(b);
    this.execute(b)
  }
})(window.FivekoGFX);
(function(b) {
  b.prototype.lbp = function() {
    var a = this.gl,
      b = this.createProgram("lbp", "\nprecision mediump float;\n\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\n#define GET_PIXEL(_x, _y) (texture2D(u_image, textCoord + onePixel*vec2(_x, _y)))\n#define CMP(_x, _y) vec4(greaterThanEqual((_x), (_y)))\n\nvoid main() {\n\tvec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\tvec4 color = GET_PIXEL(0, 0);\n\tvec4 value = CMP(color, GET_PIXEL(-1, -1))*0.5 +\n\t\t\t\t CMP(color, GET_PIXEL(-1,  0))*0.25 +\n\t\t\t\t CMP(color, GET_PIXEL(-1,  1))*0.125 +\n\t\t\t\t CMP(color, GET_PIXEL( 0,  1))*0.0625 +\n\t\t\t\t CMP(color, GET_PIXEL( 1,  1))*0.03125 +\n\t\t\t\t CMP(color, GET_PIXEL( 1,  0))*0.015625 +\n\t\t\t\t CMP(color, GET_PIXEL( 1, -1))*0.0078125 +\n\t\t\t\t CMP(color, GET_PIXEL( 0, -1))*0.00390625;\n\n\tgl_FragColor = vec4(value.rgb, 1.0);\n}");
    a.useProgram(b);
    this.execute(b)
  }
})(window.FivekoGFX);
(function(b) {
  b.prototype.harrisCorners = function() {
    var a = this.gl,
      b = this.createProgram("harris", "\nprecision mediump float;\n\n#define KERNEL_SIZE 3\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nuniform float u_kernel[KERNEL_SIZE];\nuniform int u_direction;\n\n#define GET_PIXEL(_x, _y) (texture2D(u_image, textCoord + onePixel*vec2(_x, _y)))\n\n#define DET(_p)     ((_p).x*(_p).y - (_p).z*(_p).z)\n#define TRACE(_p)   ((_p).x + (_p).y)\n// Choose desired Harris method (0 or 1)\n#define USED_METHOD 1\n\nvoid main() {\n\tvec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\t\n\tif (u_direction == 0){\n\t\tfloat dx = length((GET_PIXEL(-1, -1)*u_kernel[0] +\n\t\t\t\t\tGET_PIXEL(-1,  0)*u_kernel[1] +\n\t\t\t\t\tGET_PIXEL(-1, +1)*u_kernel[2]) -\n\t\t\t\t   (GET_PIXEL(+1, -1)*u_kernel[0] +\n\t\t\t\t\tGET_PIXEL(+1,  0)*u_kernel[1] +\n\t\t\t\t\tGET_PIXEL(+1, +1)*u_kernel[2]));\n\t\tfloat dy = length((GET_PIXEL(-1, -1)*u_kernel[0] +\n\t\t\t\t\tGET_PIXEL(0, -1)*u_kernel[1] +\n\t\t\t\t\tGET_PIXEL(+1, -1)*u_kernel[2]) -\n\t\t\t\t   (GET_PIXEL(-1, +1)*u_kernel[0] +\n\t\t\t\t\tGET_PIXEL(0, +1)*u_kernel[1] +\n\t\t\t\t\tGET_PIXEL(+1, +1)*u_kernel[2]));\n\t\t\n\t\tgl_FragColor = vec4(dx*dx, dy*dy, dx*dy, 1.0);\n\t}\n\telse\n\t{\n\t\tvec4 p = (GET_PIXEL(0, 0) + GET_PIXEL(-1, -1) +\n\t\t\t\tGET_PIXEL(-1,  0) + GET_PIXEL(-1,  1) +\n\t\t\t\tGET_PIXEL( 0,  1) + GET_PIXEL( 1,  1) +\n\t\t\t\tGET_PIXEL( 1,  0) + GET_PIXEL( 1, -1) +\n\t\t\t\tGET_PIXEL( 0, -1)) / 9.0;\n\t\n#if (USED_METHOD == 0)\n\t\tfloat k = 0.04;\n\t\tfloat R = DET(p) - (k * (TRACE(p)*TRACE(p)));\n#else  // Harris-Noble corner measure\n\t\tfloat R = DET(p) / (TRACE(p) + 1e-31);\n#endif\n\t\tgl_FragColor = vec4(vec3(max(R, 0.0)), 1.0);\n\t}\n}");
    a.useProgram(b);
    var e = a.getUniformLocation(b, "u_direction"),
      f = a.getUniformLocation(b, "u_kernel[0]");
    a.uniform1fv(f, [1, 2, 1]);
    a.uniform1i(e, 0);
    this.execute(b);
    a.uniform1i(e, 1);
    this.execute(b)
  }
})(window.FivekoGFX);
(function(b) {
  b.prototype.bilateral = function(a, b, e, f) {
    var c = this.gl,
      g = 9,
      p = Math.sqrt(2 * Math.PI) * a,
      l = 0;
    0 == g % 2 && g++;
    var q = new Float32Array(9),
      m = 2 * a * a,
      k;
    parseInt(g / 2);
    for (k = 0; 9 > k; k++) q[k] = Math.exp(-(k * k) / m) / p, l += q[k];
    for (p = 0; p < g; p++) q[p] /= l;
    l = 2 * b * b;
    g = new Float32Array(256);
    for (m = p = 0; 256 > m; m++) k = m / 255, g[m] = Math.max(Math.exp(-(k * k / l)), 0), p += g[m];
    for (m = 0; 256 > m; m++) g[m] /= p;
    l = this.createProgram("bilateralSpatial", "\nprecision mediump float;\n// our texture\nuniform sampler2D u_image;\nuniform sampler2D u_gaussTable;\nuniform vec2 u_textureSize;\nuniform float u_sptSigma;\nuniform float u_intSigma;\n#define KERNEL_SIZE 5\n#define DIFF(x, y) (((x) > (y)) ? (x - y) : (y - x))\n#define SP_DIF(r, s) max(exp(-((r)*(r))) / (2.0*s*s), 0.0)\n#define INT_DIF(r, s) max(exp(-((r)*(r)) / (2.0*s*s)), 0.0)\n#define WCALC(v1, v2) exp(-(v1 + v2))\nvoid main() {\n\tconst int ms = KERNEL_SIZE / 2;\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\tvec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\n\tvec4 centerPixel = texture2D(u_image, textCoord);\n\tvec4 meanColor = vec4(0);\n\tfloat weightSum = (0.0);\n\tfor (int i = -KERNEL_SIZE; i <= KERNEL_SIZE; i++)\n\t{\n\t\tfor (int j = -KERNEL_SIZE; j <= KERNEL_SIZE; j++) {\n\t\t\tvec4 currentPixel = texture2D(u_image, textCoord + onePixel*vec2(i, j));\n\t\t\tfloat weight = exp(-distance(centerPixel, currentPixel) / (u_intSigma));\n\t\t\tmeanColor += (currentPixel*weight);\n\t\t\tweightSum += weight;\n\t\t}\n\t}\n\tgl_FragColor = meanColor / weightSum;//vec4(meanColor.rgb/weightSum, 1.0);\n}");
    c.useProgram(l);
    p = c.getUniformLocation(l, "u_spatialKernel[0]");
    m = c.getUniformLocation(l, "u_intesityKernel[0]");
    c.activeTexture(c.TEXTURE0);
    k = c.getUniformLocation(l, "u_sptSigma");
    var h = c.getUniformLocation(l, "u_intSigma");
    c.uniform1f(k, a);
    c.uniform1f(h, 2 * b * b);
    c.uniform1fv(p, q);
    c.uniform1fv(m, g);
    for (a = 0; a < f + 1; a++) this.execute(l);
    0 < e && (f = this.gl, a = this.createProgram("bilateralSobel", "\nprecision mediump float;\n\n#define KERNEL_SIZE 3\n// our texture\nuniform sampler2D u_image;\nuniform vec2 u_textureSize;\nuniform float u_kernel[KERNEL_SIZE];\nuniform float u_threshold;\n#define GET_PIXEL(_x, _y) (texture2D(u_image, textCoord + onePixel*vec2(_x, _y)))\n \n\nvoid main() {\n\tvec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\n\tvec2 textCoord = gl_FragCoord.xy / u_textureSize;\n\tfloat dx = (length(GET_PIXEL(-1, -1)*u_kernel[0] +\n\t\t\t\tGET_PIXEL(-1,  0)*u_kernel[1] +\n\t\t\t\tGET_PIXEL(-1, +1)*u_kernel[2]) -\n\t\t\t   length(GET_PIXEL(+1, -1)*u_kernel[0] +\n\t\t\t\tGET_PIXEL(+1,  0)*u_kernel[1] +\n\t\t\t\tGET_PIXEL(+1, +1)*u_kernel[2]));\n\tfloat dy = (length(GET_PIXEL(-1, -1)*u_kernel[0] +\n\t\t\t\tGET_PIXEL(0, -1)*u_kernel[1] +\n\t\t\t\tGET_PIXEL(+1, -1)*u_kernel[2]) -\n\t\t\t   length(GET_PIXEL(-1, +1)*u_kernel[0] +\n\t\t\t\tGET_PIXEL(0, +1)*u_kernel[1] +\n\t\t\t\tGET_PIXEL(+1, +1)*u_kernel[2]));\n\tfloat v = length(vec2(dx, dy));\n\t//gl_FragColor = vec4(GET_PIXEL(0, 0).rgb*(1.0 - v*u_threshold), 1.0);\n\t\n\tif (v > u_threshold)\n\t\tgl_FragColor = vec4(GET_PIXEL(0, 0).rgb*(1.0 - v), 1.0);\n\telse \n\t\tdiscard;\n   ///gl_FragColor = vec4(length(vec2(dx, dy)), theta, 0.0, 1.0);\n}"),
      f.useProgram(a), b = f.getUniformLocation(a, "u_threshold"), c = f.getUniformLocation(a, "u_kernel[0]"), f.uniform1fv(c, [3, 10, 3]), f.uniform1f(b, e / 100), this.execute(a))
  }
})(window.FivekoGFX);

window.FivekoGFX.prototype.clear = function () {
  const gl = this.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
};
