const park = new Image();
park.src = new URL("./park.png", import.meta.url).href;
await park.decode();

export function drawPark(ctx) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(park, 0, 0, 480, 270);
  ctx.restore();
}
