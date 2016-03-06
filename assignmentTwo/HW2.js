/**
 * Created by Raphael on 3/5/2016.
 */
var express = require('express');
var app = express();
var url = require('url') ;


app.all('/gets', function (req, res) {
    validateMethod(req, res, 'GET');
});

app.all('/posts', function (req, res) {
    validateMethod(req, res, 'POST');
});

app.all('/puts', function (req, res) {
    validateMethod(req, res, 'PUT');
});

app.all('/deletes', function (req, res) {
    validateMethod(req, res, 'DELETE');
});

app.all('/', function (req, res) {
    res.writeHead(404, {'Contect-Type' : 'test/plain'});
    res.write('Page not found');
    res.end();
});

function validateMethod(req, res, method) {
    var reqMethod = req.method;
    if (reqMethod === method) {
        var query = url.parse(req.url,true).query;
        var queryTrue = url.parse(req.url,false).query;
        res.writeHead(200, {'Contect-Type' : 'test/plain'});
        if(queryTrue == null) {
            res.write('No query in Request\n');
        }
        else{
            res.write('Name and value of Request query as follows:\n');
            res.write(JSON.stringify(query) + '\n');
        }
        res.write('Request header as follows:\n');
        res.write(JSON.stringify(req.headers));
    } else {
        res.writeHead(405, {'Contect-Type' : 'test/plain'});
        res.write('HTTP method \'' + reqMethod + '\' not allowed');
    }
    res.end();
}

app.listen(8080, function () {

});