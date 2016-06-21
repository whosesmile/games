import path from 'path';

module.exports = {

  // view folder
  views: 'templates',

  // watch tempalte change
  watch: true,

  // favicon
  favicon: path.resolve(__dirname, '../favicon.ico'),

  // assets file
  assets: path.join(__dirname, '../../assets/.tmp'),
};
