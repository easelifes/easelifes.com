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
  /*
exports.getMenu = function(){
  var menu = fs.readFileSync(__dirname + '/../mdfiles/Menu.json', 'UTF-8');
  var arr = JSON.parse(menu);

 console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
 console.log(arr);
 console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

  var html = '';
  return j2t.toUlTree(arr, {fn: function(link){
    if(link.endsWith('.md'))
      return '/md/'+link;
    else
      return link;
  }});
  */

  // for(var i = 0 ; i < arr.length ; i++ ) {
  //   var _this = arr[i];
  //   if(_this.type = 'folder') {
  //     html += '<p>'+_this.name+'<br/>';
  //     if(_this.nodes && _this.nodes.length > 0)
  //     for(var j = 0 ; j < _this.nodes.length ; j++ ) {
  //       var _nodes = _this.nodes[j];
  //       html += '<small>['+_nodes.name+'](/md/'+_nodes.link+')</small>, ';
  //     }
  //     html += '<br/></p>\n\n';
  //   }
  // }
  // return mkup(html);
}


function getWiki(path, callback) {
  getWikiTxt(path, function(txt){
    console.log(mkup(txt));
    callback(mkup(txt));
  })
}
exports.getWiki = getWiki;

function getWikiTxt(path, callback) {
  dbm.getById(path, function(err,data){
    var txt = data ? data.content : null;
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
