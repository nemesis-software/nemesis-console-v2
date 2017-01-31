export function componentRequire(path, fileName) {
  try {
    return require('customFiles/' + fileName).default;
  } catch (e) {
    return require('source/' + path).default;
  }
}