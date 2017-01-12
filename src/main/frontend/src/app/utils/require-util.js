export function componentRequire(path, fileName) {
  try {
    return require('customFiles/' + fileName).default;
  } catch (e) {
    console.log('here');
    return require('source/' + path).default;
  }
}