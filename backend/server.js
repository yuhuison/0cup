var http = require('http');
var url = require("url");
var MongoClient = require('mongodb').MongoClient;
var urldb = "mongodb://localhost:27017/";

var querystring = require("querystring");
http.createServer(function (request, response) {

    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    if(pathname=="/getcomment"){
        MongoClient.connect(urldb, function(err, db) {
            if (err) throw err;
            var dbo = db.db("comments");
            dbo.collection("comments"). find({}).toArray(function(err, result) { // 返回集合中所有数据
                if (err) throw err;
                response.setHeader("Access-Control-Allow-Origin", "*"); 
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end(JSON.stringify(result));
            });
        });
        return;
    }else if(pathname=="/addcomment"){
        var params=querystring.parse(url.parse(request.url).query);
        
        MongoClient.connect(urldb, function(err, db) {
            if (err) throw err;
            var dbo = db.db("comments");
            var myobj = { name: params.nickname, content: params.comment };
            dbo.collection("comments").insertOne(myobj, function(err, res) {
                if (err) throw err;
                response.setHeader("Access-Control-Allow-Origin", "*"); 
                console.log("文档插入成功");
                db.close();
            });
        });
    }
    response.writeHead(200, {'Content-Type': 'text/plain'});

    // 发送响应数据 "Hello World"
    response.end('Hello World\n');
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
