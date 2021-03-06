 /*
* Created by Raphael - 4/23/16
*/ 

var express = require('express');
var Usergrid = require('usergrid');
var dataClient = new Usergrid.client({
    orgName:'raphaelo23',
    appName:'sandbox'
});

var app = express();
app.use(express.bodyParser());

app.get('/', function(req, res) {
    res.write('Raphael\'s Movie App');
    res.status(200); 
    res.end();
});

app.post('/movies', function(req, res) {
    
    if(req.body.name === undefined) {
        res.status(400);
        res.write('JSON movie in body is incomplete: missing name');
        res.write('\nJSON: "name": <movie title>');
        res.end();
    } else if(req.body.year === undefined) {
        res.status(400);
        res.write('JSON movie in body is incomplete: missing year');
        res.write('\nJSON: "year": <movie release year>');
        res.end();
    } else if(req.body.actors === undefined) {
        res.status(400);
        res.write('JSON movie in body is incomplete: missing actors');
        res.write('\nJSON: "actors": <[movie actors]>');
        res.end();
    } else if(req.body.actors.length < 3) {
        res.status(400);
        res.write('JSON movie in body is incomplete: must include 3 actors');
        res.write('\nJSON: "actors": <[movie actors]>');
        res.end();
    } else {
        var properties = {
            type:"movies",
            name:req.body.name,
            year:req.body.year,
            actor:req.body.actors
        };
        dataClient.createEntity(properties, function(error, result){
        	if(error) {
        	    res.status(500);
        		res.write('error adding movie to database');
                res.end();
        	} else {
        	    res.status(200);
        		res.write('the following movie has been added:\n');
                res.send(req.body);
        	}
        });
            
    }
    
}); 

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

app.get('/movies', function(req, res) {
    
    var par = req.param('reviews');
    var connecting_par = req.param('connecting');
    var connected_par = req.param('connected');
    var ql_par = req.param('ql');
    
    if(par === 'true') {
        
        if(typeof connecting_par == 'undefined') {
            res.write('missing connecting movie name');
            res.end();
        }
        if(typeof connected_par == 'undefined') {
            res.write('missing connected review name');
            res.end();
        }
        else {
            
            var connecting = { 
            	endpoint:"movies",
            	qs:{ql:"name='".concat(connecting_par).concat("'")}
            }; 
            
            dataClient.request(connecting, function (error, connecting_result) { 
            	if (error) { 
            	    res.status(500);
                    res.write('error accessing movie database\n');
                    res.end();
            	} else { 
                	    var connected = { 
                    	endpoint:"reviews",
                    	qs:{ql:"name='".concat(connected_par).concat("'")}
                    }; 
                    
                    dataClient.request(connected, function (error, connected_result) { 
                    	if (error) { 
                    	    res.status(500);
                            res.write('error accessing review database\n');
                            res.end();
                    	} else { 
                    	    res.status(200);
                    	    res.write('movie:\n');
                            res.write(JSON.stringify(connecting_result.entities));
                            res.write('\nreview:\n');
                            res.write(JSON.stringify(connected_result.entities));
                            res.end();
                            
                    	} 
                    });
            	} 
            });
        }
    } else if(isEmptyObject(req.query)) {
        var properties = { 
        	endpoint:"movies",
        }; 
        
        dataClient.request(properties, function (error, result) { 
        	if (error) { 
        	    res.status(500);
                res.write('error accessing movie database\n');
                res.send(req.query.ql);
                res.end();
        	} else { 
        	    res.status(200);
                res.send(result.entities);
                res.end();
        	} 
        });

    } else if(req.query.ql === undefined) {
        res.status(400); 
        res.write("query not valid\n?ql=<key>='<value>'");
        res.send(req.query);
        res.end();
    } else {
        var properties2 = { 
        	endpoint:"movies",
        	qs:{ql:ql_par}
        }; 
        
        dataClient.request(properties2, function (error, result) { 
        	if (error) { 
        	    res.status(500);
                res.write('error accessing movie database\n');
                res.send(req.query.ql);
                res.end();
        	} else { 
        	    res.status(200);
        	    //if(result.entities.length === 0)
        	    if(isEmptyObject(result.entities)) {
        	        res.write('movie not found');
        	    } else {
        	        res.send(result.entities);
        	    }
                res.end();
        	} 
        });
        
    }

});

app.delete('/movies', function(req, res) {
    
    var prop;
    
    if(isEmptyObject(req.query)) {
        res.status(400);
        res.write("delete request not valid\n?ql=<key>='<value>'");
        res.end();
    } else if(req.query.ql === undefined) {
        res.status(400);
        res.write("delete request not valid\n?ql=<key>='<value>'");
        res.send(req.query);
        res.end();
    } else {
        prop = { 
        	endpoint:"movies",
        	method:"DELETE",
        	qs:{ql:req.query.ql.toString()}
        }; 
        
        dataClient.request(prop, function (error, result) { 
        	if (error) { 
        	    res.status(500);
                res.write('error deleting movie from database\n');
                res.send(req.query.ql);
                res.end();
        	} else { 
        	    res.status(200);
        	    res.write('movie deleted from database\n');
                res.send(result.entities);
                res.end();
        	} 
        });
    }
});


app.listen(3000);