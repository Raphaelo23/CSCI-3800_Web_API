/*
*   Team Passhole
*   base endpoint: http://raphaelo23-test.apigee.net/passhole
*   date: 4/30/2016
*/

//initalize
var express = require('express');
var app = express();

var Usergrid = require('usergrid');
var client = new Usergrid.client({
    orgName:'raphaelo23',
    appName:'sandbox'
});

app.use(express.bodyParser());

function getList(dictionary){
    var keys = [];
        for (var key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
                keys.push(key);
        }
    }
    return keys;
}

//call methods:
/*
*   intro
*/
app.get('/', function(req, res) {
    res.write("Web API Passhole Project");
    res.status(200); 
    res.end();
});

/*takes username from parameter
*   name = username
*
*   body returns json array of urls
*   {"urls":["url1", "url2", ... , "urln"]}
*/
app.get('/urls', function(req, res) {
    var username = req.param('name');
    if (username === undefined) {
        res.status(400);
        
        res.write("no username entered");
        res.end();
    } else {
        var properties = { 
            type:'passholes',
            name: username
        };
        
        client.getEntity(properties, function (error, result) { 
        	if (error) { 
        	    res.status(400);
                res.write("invalid username");
                res.end();
        	} else { 
        	    var list = getList(result._data.url);
        	    
        	    res.status(200); 
        	    res.send({"urls":list});
        	    res.end();
        	} 
        });
    }
});


/*takes username and url from parameter
*   name = username
*   url = urlname
*
*   body returns all info 
*   {
*     "url": "my url"
*     "password": "my password",
*     "type": "my type (bank, email, etc)",
*     "createDate": "date",
*     "term": "term of password (# char) (2 m or 35 d)",
*     "comment": "my comment"
*   }
*
*/
app.get('/url', function(req, res) {
    var username = req.param('name');
    var url = req.param('url');
    
    if (username === undefined) {
        res.status(400);
        res.write("no username entered");
        res.end();
    } else if (url === undefined) {
        res.status(400);
        res.write("no url entered");
        res.end();
    } else {
        var properties = { 
            type:'passholes',
            name: username,
        };
        
        client.getEntity(properties, function (error, result) { 
        	if (error) { 
        	    res.status(400);
                res.write("invalid username");
                res.end();
        	} else { 
        	    
        	    var body = {
        	        "url": url,
                    "password": result._data.url[url].password,
                    "type": result._data.url[url].type,
                    "createDate": result._data.url[url].createDate,
                    "term": result._data.url[url].term,
                    "comment": result._data.url[url].comment,
                    "urlusername": result._data.url[url].urlusername
                };
        	    
        	    res.status(200); 
        	    res.send(body);
        	    res.end(); 
        	} 
        });
    }
});


/*takes username and url from parameter
*   name = username
*   url = urlname
*
*   body returns password
*   {"password":"my password"}
*/
app.get('/url/password', function(req, res) {
    var username = req.param('name');
    var url = req.param('url');
    
    if (username === undefined) {
        res.status(400);
        res.write("no username entered");
        res.end();
    } else if (url === undefined) {
        res.status(400);
        res.write("no url entered");
        res.end();
    } else {
        var properties = { 
            type:'passholes',
            name: username,
        };
        
        client.getEntity(properties, function (error, result) { 
        	if (error) { 
        	    res.status(400);
                res.write("invalid username");
                res.end();
        	} else { 
        	    res.status(200);
        	    res.send({"password": result._data.url[url].password});
        	    res.end();
        	} 
        });
    }
});


/*takes username and url from parameter
*   name = username
*   url = urlname
*
*   body returns number of days till expiration
*   {"days":"#"}
*
*/
app.get('/url/expiration', function(req, res) {
    var username = req.param('name');
    var url = req.param('url');
    
    if (username === undefined) {
        res.status(400);
        res.write("no username entered");
        res.end();
    } else if (url === undefined) {
        res.status(400);
        res.write("no url entered");
        res.end();
    } else {
        var properties = { 
            type:'passholes',
            name: username,
        };
        
        client.getEntity(properties, function (error, result) { 
        	if (error) { 
        	    res.status(400);
                res.write("invalid username");
                res.end();
        	} else { 
        	    
        	    //not working
        	    var cDate = new Date(result._data.url[url].createDate);
        	    var day = result._data.url[url].term;
                var eDate = new Date(cDate.setTime( cDate.getTime() + day * 86400000 ));
                var expiresIn = (Math.abs(eDate - Date())) * 86400000;
        	    
        	    res.status(200);
        	    res.send({"day": expiresIn});
        	    res.end();
        	} 
        });
    }
});


/*takes username, url and a field to update from body
*   {"name":"username",
*   "url":"urlname"
*   "term":"updated term"}
*
*   no return body 
*   success/fail based on response code
*
*/
app.put('/url', function(req, res) {
    
    var username = req.body.name;
    var url = req.body.url;
    
    if (username === undefined) {
        res.status(400);
        res.write("no username entered");
        res.end();
        return;
    } else if (url === undefined) {
        res.status(400);
        res.write("no url entered");
        res.end();
        return;
    } else {
        var properties = { 
            type:'passholes',
            name: username,
        };
        
        client.getEntity(properties, function (error, result) { 
        	if (error) { 
        	    res.status(400);
                res.write("invalid username");
                res.end();
                return;
        	} else { 
        	    
        	    jsonUrlEntity = result._data.url;
        	    
        	    if(req.body.password !== undefined) {
                    jsonUrlEntity[url].password = req.body.password;
                } 
                if (req.body.type !== undefined) {
                    jsonUrlEntity[url].type = req.body.type;
                } 
                if (req.body.createDate !== undefined) {
                    jsonUrlEntity[url].createDate = req.body.createDate;
                } 
                if (req.body.term !== undefined) {
                    jsonUrlEntity[url].term = req.body.term;
                } 
                if (req.body.comment !== undefined) {
                    jsonUrlEntity[url].comment = req.body.comment;
                }
                if (req.body.urlusername !== undefined) {
                    jsonUrlEntity[url].urlusername = req.body.urlusername;
                }
        	    
        	    var data = {
                    type:'passholes',
                    uuid:result._data.uuid,
                    url:jsonUrlEntity
                };
                
                var properties = {
                    client:client,
                    data:data
                };
                
                var entity = new Usergrid.entity(properties);
    
                //Call Entity.save() to initiate the API PUT request
                entity.save(function (error, result) {
                
                    if (error) { 
                        res.status(400);
                		res.send("update failed");
                		res.end();
                		return;
                	} else { 
                	   	res.status(200);
                		res.send(result.entities);
                		res.end(); 
                		return;
                	}
                }); 
        	} 
        });
    }
});

/*takes username, url from body
*   {"name":"username",
*   "url":"urlname"}
*
*   deletes one credential
*
*   no return body 
*   success/fail based on response code
*
*/
app.delete('/url', function(req, res) {
    //todo
    res.status(200); 
    res.end();
});

/*takes username and all json fields to be add from body
*   
*   required (name, password, url)
*   
*   {"name":"my username",
*   "url":"urlname",
*   "password": "my_password",
*   "type": "my type",
*   "urlusername": "my_user",
*   "createDate": "date password created/updated",
*   "term": "how long password is good for",
*   "comment": "my comment"}
*
*   note:
*   term is only in days
*   35 days = 35
*   no combinations 
*
*   no return body 
*   success/fail based on response code
*
*/
app.post('/url', function(req, res) {
   
    var username = req.body.name;
    var url = req.body.url;
    var password = req.body.password;
    var urlUsername = req.body.urlusername;
    
    if (username === undefined) {
        res.status(400);
        res.write("no username entered");
        res.end();
        return;
    } else if (url === undefined) {
        res.status(400);
        res.write("no url entered");
        res.end();
        return;
    } else if (password === undefined) {
        res.status(400);
        res.write("no password entered");
        res.end();
        return;
    } else if (urlUsername === undefined) {
        res.status(400);
        res.write("no url username entered");
        res.end();
        return;
    } else {
        
        var newData = {password:password, urlusername:urlUsername};
        
        if (req.body.type !== undefined) {
            newData.type = req.body.type;
        } 
        if (req.body.createDate !== undefined) {
            newData.createDate = req.body.createDate;
        } 
        if (req.body.term !== undefined) {
            newData.term = req.body.term;
        } 
        if (req.body.comment !== undefined) {
            newData.comment = req.body.comment;
        }
        
        var properties = { 
            type:'passholes',
            name: username,
        };
        
        client.getEntity(properties, function (error, result) { 
        	if (error) { 
        	    res.status(400);
                res.write("invalid username");
                res.end();
                return;
        	} else { 
        	    
        	    jsonUrlEntity = result._data.url;
        	    
                if(jsonUrlEntity[url] !== undefined) {
                    res.status(400);
                    res.write("url already exisits");
                    res.end();
                    return;
                }
                
                jsonUrlEntity[url] = newData;
        	    
        	    var data = {
                    type:'passholes',
                    uuid:result._data.uuid,
                    url:jsonUrlEntity
                };
                
                var properties = {
                    client:client,
                    data:data
                };
                
                var entity = new Usergrid.entity(properties);
    
                //Call Entity.save() to initiate the API PUT request
                entity.save(function (error, result) {
                
                    if (error) { 
                        res.status(400);
                		res.send("update failed");
                		res.end();
                		return;
                	} else { 
                	   	res.status(200);
                		res.send(result.entities);
                		res.end(); 
                		return;
                	}
                }); 
        	} 
        });
    }
});


/*takes username from body
*
*   {"name":"username")
*
*   deletes user
*   
*   no return body 
*   success/fail based on response code
*/
app.delete('/user', function(req, res) {
    var username = req.body.name;
    
    if (username === undefined) {
        res.status(400);
        res.write("no username entered");
        res.end();
        return;
    }
    
    var properties = { 
        type:'passholes',
        name: username,
    };
    
    client.getEntity(properties, function (error, result) { 
    	if (error) { 
    	    res.status(400);
            res.write("invalid username");
            res.end();
            return;
    	} else { 
    	    var uuid = result._data.uuid;
    	    
            var prop = {
                client:client,
                data:{
                    'type': 'passholes',
                    'uuid': uuid
                }
            };
	
            //create the entity object
            var entity = new Usergrid.entity(prop);
            
            //call destroy() to initiate the API DELETE request
            entity.destroy(function (err, result) {
            
            	if (err) { 
            	    res.status(400);
                    res.write("delete failed");
                    res.end();
                    return;
            	} else {
            	    res.status(200);
                    res.write("delete success");
                    res.end();
                    return;
            	}
            });
    	}
    });
});


/*takes username from body
*
*   {"name":"username")
*
*   adds user
*   
*   no return body 
*   success/fail based on response code
*/
app.post('/user', function(req, res) {
    var username = req.body.name;
    
    if (username === undefined) {
        res.status(400);
        res.write("no username entered");
        res.end();
        return;
    }
    
    var properties = {
    	type:"passholes", //Requried. Type of entity to create.
    	name:username,
    	url:{}
    };
    
    //Call createEntity to initiate the API call
    client.createEntity(properties, function(error, result){
        if (error) { 
            res.status(400);
            res.write("creation failed");
            res.end();
            return;
        } else {
            res.status(200);
            res.write("creation success");
            res.end();
            return;
        }
    });
});

app.listen(3000);