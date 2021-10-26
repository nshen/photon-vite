import init, { filter, open_image, putImageData, watermark } from "photon-web";

init().then(() => {
  // watermark image
  const watermark_img = document.getElementById(
    "watermark"
  ) as HTMLImageElement;
  // source image
  const srcimg = document.getElementById("srcimg") as HTMLImageElement;
  // main canvas to draw
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  // setup watermark
  const watermark_canvas = document.createElement("canvas");
  watermark_canvas.width = watermark_img.width;
  watermark_canvas.height = watermark_img.height;
  const watermark_ctx = watermark_canvas.getContext("2d");
  watermark_ctx.drawImage(watermark_img, 0, 0);

  const ctx = canvas.getContext("2d");
  // Draw the image element onto the canvas
  ctx.drawImage(srcimg, 0, 0);

  // Convert the ImageData found in the canvas to a PhotonImage (so that it can communicate with the core Rust library)
  let src_photon_img = open_image(canvas, ctx);
  let watermark_photon_img = open_image(watermark_canvas, watermark_ctx);

  // Filter the image, the PhotonImage's raw pixels are modified
  filter(src_photon_img, "radio");
  // add watermark
  watermark(src_photon_img, watermark_photon_img, 30, 40);

  // Place the modified image back on the canvas
  putImageData(canvas, ctx, src_photon_img);
});
