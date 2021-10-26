import { i as init, o as open_image, f as filter, w as watermark, p as putImageData } from "./vendor.827a1c03.js";
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
init().then(() => {
  const watermark_img = document.getElementById("watermark");
  const srcimg = document.getElementById("srcimg");
  const canvas = document.getElementById("canvas");
  const watermark_canvas = document.createElement("canvas");
  watermark_canvas.width = watermark_img.width;
  watermark_canvas.height = watermark_img.height;
  const watermark_ctx = watermark_canvas.getContext("2d");
  watermark_ctx.drawImage(watermark_img, 0, 0);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(srcimg, 0, 0);
  let src_photon_img = open_image(canvas, ctx);
  let watermark_photon_img = open_image(watermark_canvas, watermark_ctx);
  filter(src_photon_img, "radio");
  watermark(src_photon_img, watermark_photon_img, 30, 40);
  putImageData(canvas, ctx, src_photon_img);
});
