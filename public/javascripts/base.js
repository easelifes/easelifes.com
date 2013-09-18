$(document).ready(function(){
  $('#show').click(function() { 
    $.blockUI({ 
      message: $('#md'), 
      onOverlayClick: $.unblockUI,
      css: { 
        border: 'none', 
        padding: '15px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px',  
        '-moz-border-radius': '10px', 
        opacity: .8, 
        color: '#fff', 
        "vertical-align": "left",
        top:  "30px",
        left: ($(window).width() - 810) /2 + 'px', 
        width: '810px' 
      }
    }); 
  });

  $('#loginbar').on('click', function(){
    $.blockUI({ 
      message: $('#loginblock'), 
      onOverlayClick: $.unblockUI,
      css: { 
        border: 'none', 
        padding: '15px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px',  
        '-moz-border-radius': '10px', 
        opacity: .8, 
        color: '#fff', 
        "vertical-align": "left",
        top:  "50px",
        left: ($(window).width() - 400 - 35) + 'px',
        width: '400px',
        height: '190px'
      }
    }); 
  })

  $('#logoutbar').on('click', function(){
    document.location = '/logout';
  });

});

var mkdOpt = {
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
};

function getURLParameter(name) {
  var u = decodeURI(
    (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );

  if(u == 'null' || u == 'NULL') 
    return null;
  else
    return u;
}

function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

function htmlUnescape(value){
    return String(value)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

function json2ul(json) {
  var _html = '<ul>';
  var keys = Object.keys(json);
  for(var i = 0; i<keys.length ; i++) {
    _html += '<li>' + keys[i] + ' : ' + ( typeof(json[keys[i]]) == 'Object' ? json2ul(json[keys[i]]) : format(json[keys[i]]) ) + '</li>';
  }
  _html += '</ul>';
  return _html;
}

function format(txt) {
  if (txt.indexOf('http://') == 0 || txt.indexOf('https://') == 0) {
    return '<a href="' + txt + '">' + txt + '</a>';
  } else if (txt.indexOf('git://') == 0) {
    return '<a href="' + txt.replace(/git/,'https') + '">' + txt + '</a>';
  } else {
    return txt;
  }
}


