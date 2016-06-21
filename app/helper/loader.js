import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import helper from '.';
import config from '../config';

module.exports = nunjucks.FileSystemLoader.extend({
  getSource: function (name) {
    // callsite for dynamic calculate template path
    // helper.callsite().forEach(function(obj) {
    //   console.log('****', obj.getFileName())
    // });
    var module = path.dirname(helper.callsite()[7].getFileName());
    var abspath = path.resolve(module, name);
    if (!name.startsWith('.') && !name.startsWith(config.views)) {
      abspath = path.resolve(module, config.views, name);
    }

    if (!abspath) {
      return null;
    }

    // cache template
    this.pathsToNames[abspath] = name;

    return {
      src: fs.readFileSync(abspath, 'utf-8'),
      path: abspath,
      noCache: this.noCache
    };
  }
});