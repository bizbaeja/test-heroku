console.log(process.version);
new TextEncoder();
module.exports = {
  testEnvironment: "node",
};
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
module.exports = {
  transform: {
    "^.+\\.(js|jms)$": "js-jest",
  },
};
