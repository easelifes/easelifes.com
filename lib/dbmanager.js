var util = require('util')                                                                                                                                
  , cradle = require('cradle')
  , dbusername = 'ease' // 填入你的姓名
  , dbpassword = 'easelife' // 填入你的密碼
  , databasename = 'ease' // 填入你的資料表名稱
  , db_address = '211.78.254.192' //填入你的DB Server位置
  , db_port = 5984 // 如果不是使用預設port，需要修改
  , db = new(cradle.Connection)('http://' + db_address, db_port, {
    auth: { username: dbusername, password: dbpassword },
    cache: false,
    raw: false
  }).database(databasename);


module.exports = {
  getById : function(id, callback) {
    console.log('Query of %s', id);
    db.get( id, function (err, doc) {
      if(err) console.log(err);
      callback(err, doc);
    });
  }, 
  addData : function(id, doc, callback) {
    db.save(id, doc, function(err, res){
      if(err) console.log(err);
      callback(err, res);
    });
  },
  updateById : function(id, doc, callback) {
    db.merge(id, doc, function (err, res) {
      if(err) console.log(err);
      callback(err, res);
    });
 },
 deleteById : function(id, rev, callback) {
    db.remove(id, rev, function(err, res){
      if(err) console.log(err);
      callback(err, res);
    })
 }
}



