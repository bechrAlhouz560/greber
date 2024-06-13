const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: ['style-loader', 'css-loader'],
});

module.exports = {
  // Put your normal webpack config below here
  // mode:"production",
  module: {
    rules,
  },
};
