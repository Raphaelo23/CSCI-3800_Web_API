/**
 * Created by Raphael on 3/25/2016.
 */
var express = require('express');
var app = express();
var url = require('url');


app.get('/validate', function (req, res) {

    gitHubToken('0316d22282678c04a2b7af4123ad599be402ef4b', res);

});

app.get('/', function (req, res) {

    res.write('Raphael\'s OAuth App');
    res.end();

});

function gitHubToken(token, response) {

    var GitHubApi = require("github");

    var github = new GitHubApi({
        // required
        version: "3.0.0"
    });

    //var token = "0316d22282678c04a2b7af4123ad599be402ef4b";

    github.authenticate({
        type: "oauth",
        token: token
    });

    github.user.get({ user: 'Raphaelo23'} , function(err, res) {

        var gitHubJsonObject = JSON.parse(JSON.stringify(res));

        response.write('user name: ' + gitHubJsonObject.login.toString() + '\n');
        response.write('user repos_url: ' + gitHubJsonObject.repos_url.toString() + '\n');
        response.end();

    });
}

app.listen(9000, function () {

});