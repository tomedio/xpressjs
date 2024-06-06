const { format } = require('winston')

let lastTimestamp = 0;

const uniqueTimestamp = format((info) => {
  const now = Date.now();
  if (now <= lastTimestamp) {
    lastTimestamp++;
  } else {
    lastTimestamp = now;
  }
  info.timestamp = new Date(lastTimestamp).toISOString();
  return info;
});

module.exports = {
  uniqueTimestamp
}
