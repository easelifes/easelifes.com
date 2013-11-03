var marked = require('marked')
  , fs = require('fs')
  , j2t = require('json2tree')
  , dbm = require('./dbmanager')
  , util = require('util')

/**
 * Translate markdown text to html
 */
function mkup(txt) {
  if(!txt || txt == '') return '';
  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    langPrefix: 'language-',
    highlight: function(code, lang) {
      if (lang === 'js') {
        return highlighter.javascript(code);
      }
      return code;
    }
  });
  return marked(txt);
}
exports.md2html = mkup;

/**
 * Get the menu html
 */
exports.getMenu = function(callback){
  getWiki('Menu.md', callback);
}


function getWiki(path, callback) {
  getWikiTxt(path, function(txt){
    //console.log(mkup(txt));
    callback(mkup(txt));
  })
}
exports.getWiki = getWiki;

function getWikiTxt(path, callback) {
  dbm.getById(path, function(err,data){
    var txt = data ? data.content : null;
    if(err) {
      console.log('>>>>>>', err);
      callback(null);
    } else
      callback(txt);
  });
}
exports.getWikiTxt = getWikiTxt;

function saveWiki(path, content, callback) {
  dbm.addData(path, {
    content: content,
    createData: new Date().getTime(),
    updateData: new Date().getTime()
  }, callback);
}
exports.saveWiki = saveWiki;
