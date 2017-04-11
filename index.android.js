// polyfill for windows.crypto.getRandomValues
if (!window) window = {}
if (!window.crypto) {
  window.crypto = { getRandomValues: require('polyfill-crypto.getrandomvalues') }
}
import './App';

