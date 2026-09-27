// Node 18 compatibility shim for Docusaurus 2.1.x
if (typeof global.File === 'undefined') {
  global.File = class extends Blob {
    constructor(blobParts, filename, options) {
      super(blobParts, options);
      this.name = filename;
      this.lastModified = options?.lastModified || Date.now();
    }
  };
}
