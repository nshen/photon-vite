let wasm;
const heap = new Array(32).fill(void 0);
heap.push(void 0, null, true, false);
function getObject(idx) {
  return heap[idx];
}
let heap_next = heap.length;
function dropObject(idx) {
  if (idx < 36)
    return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
function addHeapObject(obj) {
  if (heap_next === heap.length)
    heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
function debugString(val) {
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    return toString.call(val);
  }
  if (className == "Object") {
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  if (val instanceof Error) {
    return `${val.name}: ${val.message}
${val.stack}`;
  }
  return className;
}
let WASM_VECTOR_LEN = 0;
let cachegetUint8Memory0 = null;
function getUint8Memory0() {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory0;
}
let cachedTextEncoder = new TextEncoder("utf-8");
const encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function(arg, view) {
  const buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length);
    getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len);
  const mem = getUint8Memory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127)
      break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
let cachegetInt32Memory0 = null;
function getInt32Memory0() {
  if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}
let cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
  return instance.ptr;
}
function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1);
  getUint8Memory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
function getArrayU8FromWasm0(ptr, len) {
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function putImageData(canvas, ctx, new_image) {
  _assertClass(new_image, PhotonImage);
  var ptr0 = new_image.ptr;
  new_image.ptr = 0;
  wasm.putImageData(addHeapObject(canvas), addHeapObject(ctx), ptr0);
}
function open_image(canvas, ctx) {
  var ret = wasm.open_image(addHeapObject(canvas), addHeapObject(ctx));
  return PhotonImage.__wrap(ret);
}
function filter(img, filter_name) {
  _assertClass(img, PhotonImage);
  var ptr0 = passStringToWasm0(filter_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len0 = WASM_VECTOR_LEN;
  wasm.filter(img.ptr, ptr0, len0);
}
function watermark(img, watermark2, x, y) {
  _assertClass(img, PhotonImage);
  _assertClass(watermark2, PhotonImage);
  wasm.watermark(img.ptr, watermark2.ptr, x, y);
}
function isLikeNone(x) {
  return x === void 0 || x === null;
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
  }
}
let cachegetUint8ClampedMemory0 = null;
function getUint8ClampedMemory0() {
  if (cachegetUint8ClampedMemory0 === null || cachegetUint8ClampedMemory0.buffer !== wasm.memory.buffer) {
    cachegetUint8ClampedMemory0 = new Uint8ClampedArray(wasm.memory.buffer);
  }
  return cachegetUint8ClampedMemory0;
}
function getClampedArrayU8FromWasm0(ptr, len) {
  return getUint8ClampedMemory0().subarray(ptr / 1, ptr / 1 + len);
}
Object.freeze({ Nearest: 1, "1": "Nearest", Triangle: 2, "2": "Triangle", CatmullRom: 3, "3": "CatmullRom", Gaussian: 4, "4": "Gaussian", Lanczos3: 5, "5": "Lanczos3" });
class PhotonImage {
  static __wrap(ptr) {
    const obj = Object.create(PhotonImage.prototype);
    obj.ptr = ptr;
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_photonimage_free(ptr);
  }
  constructor(raw_pixels, width, height) {
    var ptr0 = passArray8ToWasm0(raw_pixels, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.photonimage_new(ptr0, len0, width, height);
    return PhotonImage.__wrap(ret);
  }
  static new_from_base64(base64) {
    var ptr0 = passStringToWasm0(base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.photonimage_new_from_base64(ptr0, len0);
    return PhotonImage.__wrap(ret);
  }
  static new_from_byteslice(vec) {
    var ptr0 = passArray8ToWasm0(vec, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.photonimage_new_from_byteslice(ptr0, len0);
    return PhotonImage.__wrap(ret);
  }
  get_width() {
    var ret = wasm.photonimage_get_width(this.ptr);
    return ret >>> 0;
  }
  get_raw_pixels() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.photonimage_get_raw_pixels(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  get_height() {
    var ret = wasm.photonimage_get_height(this.ptr);
    return ret >>> 0;
  }
  get_base64() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.photonimage_get_base64(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  get_image_data() {
    var ret = wasm.photonimage_get_image_data(this.ptr);
    return takeObject(ret);
  }
  set_imgdata(img_data) {
    wasm.photonimage_set_imgdata(this.ptr, addHeapObject(img_data));
  }
}
async function load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}
async function init(input) {
  if (typeof input === "undefined") {
    input = "/assets/photon_web_bg.wasm";
  }
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbg_new_693216e109162396 = function() {
    var ret = new Error();
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
    try {
      console.error(getStringFromWasm0(arg0, arg1));
    } finally {
      wasm.__wbindgen_free(arg0, arg1);
    }
  };
  imports.wbg.__wbg_instanceof_Window_c4b70662a0d2c5ec = function(arg0) {
    var ret = getObject(arg0) instanceof Window;
    return ret;
  };
  imports.wbg.__wbg_document_1c64944725c0d81d = function(arg0) {
    var ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
  };
  imports.wbg.__wbg_body_78ae4fd43b446013 = function(arg0) {
    var ret = getObject(arg0).body;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
  };
  imports.wbg.__wbg_createElement_86c152812a141a62 = function() {
    return handleError(function(arg0, arg1, arg2) {
      var ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_width_16bd64d09cbf5661 = function(arg0) {
    var ret = getObject(arg0).width;
    return ret;
  };
  imports.wbg.__wbg_height_368bb86c37d51bc9 = function(arg0) {
    var ret = getObject(arg0).height;
    return ret;
  };
  imports.wbg.__wbg_data_1ae7496c58caf755 = function(arg0, arg1) {
    var ret = getObject(arg1).data;
    var ptr0 = passArray8ToWasm0(ret, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbg_newwithu8clampedarrayandsh_1b8c6e1bede43657 = function() {
    return handleError(function(arg0, arg1, arg2, arg3) {
      var ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0, arg3 >>> 0);
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_3abbe7ec7af32cae = function(arg0) {
    var ret = getObject(arg0) instanceof CanvasRenderingContext2D;
    return ret;
  };
  imports.wbg.__wbg_drawImage_9e2d13329d92a0a3 = function() {
    return handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
      getObject(arg0).drawImage(getObject(arg1), arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
    }, arguments);
  };
  imports.wbg.__wbg_getImageData_9ffc3df78ca3dbc9 = function() {
    return handleError(function(arg0, arg1, arg2, arg3, arg4) {
      var ret = getObject(arg0).getImageData(arg1, arg2, arg3, arg4);
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_putImageData_b9544b271e569392 = function() {
    return handleError(function(arg0, arg1, arg2, arg3) {
      getObject(arg0).putImageData(getObject(arg1), arg2, arg3);
    }, arguments);
  };
  imports.wbg.__wbg_settextContent_799ebbf96e16265d = function(arg0, arg1, arg2) {
    getObject(arg0).textContent = arg1 === 0 ? void 0 : getStringFromWasm0(arg1, arg2);
  };
  imports.wbg.__wbg_appendChild_d318db34c4559916 = function() {
    return handleError(function(arg0, arg1) {
      var ret = getObject(arg0).appendChild(getObject(arg1));
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_instanceof_HtmlCanvasElement_25d964a0dde6717e = function(arg0) {
    var ret = getObject(arg0) instanceof HTMLCanvasElement;
    return ret;
  };
  imports.wbg.__wbg_width_555f63ab09ba7d3f = function(arg0) {
    var ret = getObject(arg0).width;
    return ret;
  };
  imports.wbg.__wbg_setwidth_c1a7061891b71f25 = function(arg0, arg1) {
    getObject(arg0).width = arg1 >>> 0;
  };
  imports.wbg.__wbg_height_7153faec70fbaf7b = function(arg0) {
    var ret = getObject(arg0).height;
    return ret;
  };
  imports.wbg.__wbg_setheight_88894b05710ff752 = function(arg0, arg1) {
    getObject(arg0).height = arg1 >>> 0;
  };
  imports.wbg.__wbg_getContext_f701d0231ae22393 = function() {
    return handleError(function(arg0, arg1, arg2) {
      var ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_newnoargs_be86524d73f67598 = function(arg0, arg1) {
    var ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_call_888d259a5fefc347 = function() {
    return handleError(function(arg0, arg1) {
      var ret = getObject(arg0).call(getObject(arg1));
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_self_c6fbdfc2918d5e58 = function() {
    return handleError(function() {
      var ret = self.self;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_window_baec038b5ab35c54 = function() {
    return handleError(function() {
      var ret = window.window;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_globalThis_3f735a5746d41fbd = function() {
    return handleError(function() {
      var ret = globalThis.globalThis;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_global_1bc0b39582740e95 = function() {
    return handleError(function() {
      var ret = global.global;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === void 0;
    return ret;
  };
  imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
  };
  if (typeof input === "string" || typeof Request === "function" && input instanceof Request || typeof URL === "function" && input instanceof URL) {
    input = fetch(input);
  }
  const { instance, module } = await load(await input, imports);
  wasm = instance.exports;
  init.__wbindgen_wasm_module = module;
  return wasm;
}
export { filter as f, init as i, open_image as o, putImageData as p, watermark as w };
