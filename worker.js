window = this; // oh yeah, boy

importScripts('./lib.js');

let canvas;
let fivekogfx;
let bitmap;

onmessage = event => {
  console.log(event.data);

  switch (event.data.type) {
    case 'init':
      canvas = event.data.canvas;
      fivekogfx = new FivekoGFX(canvas);
      break;

    case 'image':
      bitmap = event.data.imageBitmap;
      fivekogfx.load(bitmap);
      fivekogfx.draw();
      break;

    case 'loadGPU':
      fivekogfx.load(bitmap);

      let i = 200;

      while (--i) {
        fivekogfx.gauss(5);
      }

      fivekogfx.draw();

      break;

    case 'value':
      fivekogfx.load(bitmap);

      if (!bitmap) {
        break;
      }

      let value = event.data.value;

      if (value === 0) {
        fivekogfx.draw();
        return;
      }

      while (value > 0) {
        fivekogfx.gauss(event.data.value);
        value -= 5;
      }

      fivekogfx.draw();
      break;

    default:
      break;
  }
};
