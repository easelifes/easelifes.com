var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , util = require('util')
  , fs = require('fs')
  , marked = require('marked')
  , partials = require('express-partials')
  , nu = require('nodeutil')
  , log = nu.logger.getInstance('server')
  , mdutil = require('./lib/mdutil')
  , genrss = require('./lib/gen-rss')
  , gensitemap = require('./lib/gen-sitemap')
  , cfg = require('./lib/cfg')

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set("view options", {layout : true});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(partials());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());


app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/mdfiles', express.static(path.join(__dirname, 'mdfiles')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function getMenu(req, res, next){
  if(req.session.menu) {
    log.info('Get menu from session...');
    next();
  } else {
    log.info('Reload the menu...');
    //req.session.menu = mdutil.getMenu();
    mdutil.getMenu(function(data){
      req.session.menu = data;
      next();
    });
  }
}

app.get('/', getMenu,
  function(req, res){
    var path = 'README.md';
    //var txt = fs.readFileSync(path, 'utf-8');
    log.info('Got md: ' + path);
    mdutil.getWiki(path, function(data){
      res.render('index', {
        //md: mdutil.md2html(txt),
        md: data,
        header: cfg.site.title,
        keywords: cfg.site.title,
        path: path
      });
    });
});

var cache = {};
exports.cache = cache;
app.get('/md/:file', getMenu, function(req, res){
  var path = req.params.file;
  if(!cache[path]) {
    mdutil.getWiki(path, function(txt){
      if(!txt) {
        res.render('pagenotfound', {
          path: path
        });
      } else {
        var header = txt.split('\n')[0];
        var keywords = getKeywords(txt);
        log.warn(keywords);
        cache[path] = {txt: txt, header: header };
        log.info('Got md: ' + path);
        res.render('index', {
          md: txt,
          header: header,
          keywords: keywords,
          path: path
        });
      }
    });
  } else {
    log.info('Got md from cache: ' + path);
    var txt = cache[path].txt;
    var header = txt.split('\n')[0];
    var keywords = getKeywords(txt);
    log.warn(keywords);
    res.render('index', {
      md: mdutil.md2html(txt),
      header: header,
      keywords: keywords,
      path: path
    });
  }
});

app.get('/addwiki', getMenu, function(req, res){
  log.info("=======>this is get" );
  var opt = { layout: 'layout' };
  
  if(req.query.path) 
    opt.path = req.query.path;
  
  if(req.query.path) 
    mdutil.getWikiTxt(req.query.path, function(data) {
      if(data)
        opt.content = data;
      res.render('addwiki',opt);

    });
  else
    res.render('addwiki',opt);
});

app.post('/addwiki', function(req, res){
  log.info("body=======>");
  log.info(req.body);
  mdutil.saveWiki(req.body.path, req.body.content, function(err, data){
    if(err) log.error(err);
    
    delete cache[req.body.path];
    
    if(req.body.path == 'Menu.md')
      delete req.session['menu'];

    res.redirect(util.format('/md/%s', req.body.path));
  });
});

app.post('/login', function(req, res){
  if(req.body.username == 'admin' && req.body.password == 'password') {
    req.session.user = {
      username: req.body.username
    }
    res.redirect('/');
  } else {
    res.render('error', {
      layout:'layout',
      msg: 'Login Error!'
    });
  }
});

app.get('/logout', function(req, res){
  delete req.session.user;
  res.redirect('/');
});

function getKeywords(txt){
  var lines = txt.split('\n');
  var out = '';
  for(var i = 0 ; i < lines.length -1 ; i++) {
    if(lines[i].startsWith('## ')) {
      out = out + (out.length > 0 ? ',' : '') + lines[i].replace(/##\ /g,'');
    }
  }
  return out;
}

app.post('/flush', getMenu, function(req, res){
  log.warn('Got flush request...');
  cache = {};
  log.info('Done flush...');
  res.render('index', {
    md: 'Flush all cached md files... done.'
  });
});

app.post('/flush/:file', getMenu, function(req, res){
  log.warn('Got flush request of %s', req.params.file);
  delete cache[req.params.file];
  log.info('Done flush %s', req.params.file);
  res.render('index', {md: 'Flush all cached md files... done.'});
});

//TODO: cache it
app.get('/rss', function(req, res) {
  res.end(genrss.toRss());
});

app.get('/rss.xml', function(req, res) {
  res.end(genrss.toRss());
});

app.get('/sitemap', function(req, res) {
  gensitemap.toSiteMap(function(r){
    res.end(r);
  });
});
app.get('/sitemap.xml', function(req, res) {
  gensitemap.toSiteMap(function(r){
    res.end(r);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
