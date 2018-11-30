class MyWebWorker {
  constructor() {
    this.worker = new Worker('worker.js');
    this.canvas = document.getElementById('cvs');
    this.offscreenCanvas = this.canvas.transferControlToOffscreen();
    this.init();
  }

  init() {
    this.worker.postMessage({
      type: 'init',
      canvas: this.offscreenCanvas,
    }, [this.offscreenCanvas]);
  }

  sendBitmap(imageBitmap) {
    this.worker.postMessage({
      type: 'image',
      imageBitmap,
    }, [imageBitmap]);
  }

  setValue(value) {
    this.worker.postMessage({
      type: 'value',
      value,
    });
  }

  loadGPU() {
    this.worker.postMessage({
      type: 'loadGPU',
    });
  }
}
