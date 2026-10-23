// Independent build-only adapter: emulate legacy Node's string coercion for
// UglifyJS 2 SourceMap objects. No parser or minifier source is modified.
const fs = require('fs');
const original = fs.writeFileSync;
fs.writeFileSync = function(file, data, options) {
  if (data && typeof data === 'object' && !Buffer.isBuffer(data) && !ArrayBuffer.isView(data)
      && typeof data.add === 'function' && typeof data.get === 'function'
      && typeof data.toString === 'function') data = data.toString();
  return original.call(fs, file, data, options);
};
