const { createReadStream } = require('fs');
const { join } = require('path');

module.exports = (req, res) => {
  const filePath = join(__dirname, '..', 'build', 'index.html');
  res.setHeader('Content-Type', 'text/html');
  createReadStream(filePath).pipe(res);
};
