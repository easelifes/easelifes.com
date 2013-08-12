var fs = require('fs')
  , nu = require('nodeutil')
  , util = require('util')
  , _ = require('underscore')
  , logger = require('../lib/logger')
  , cfg = require('./cfg')

var mdfilepath = __dirname + '/../mdfiles';

// Site map template layout
var tpl = '<?xml version="1.0" encoding="UTF-8"?> <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> %s </urlset>'; 

// Site map subset layout
var map = '<url><loc>%s</loc></url>';

/**
 * Convert mdfiles to site map format
 */
exports.toSiteMap = function(cb){
  var maps = '';
  fs.readdir(mdfilepath, function(e, files) {
    files.forEach(function(file, i) {
      console.log('Processing of %s (md file: %s)', file, file.endsWith('.md'));
      if(file.endsWith('.md')) {
        //maps += util.format(map, 'http://doc.micloud.tw/index.html?page='+file);
        maps += util.format(map, cfg.site.domain + '/md/' + file);
      }
    });

    var out = util.format(tpl, maps);
    cb(out);
  });
}
