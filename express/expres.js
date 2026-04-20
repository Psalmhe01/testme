var express = require('express');
var app = express();

//First middleware before response is sent
app.use(function(req, res, next){
//-   res.send("Start..."); //Cannot do this and still send more output to client
   res.locals.msg = "Start... "; // Use res.locals to avoid global variable issues
   next();
});

//Route handler
app.get('/', function(req, res, next){
   res.send("You did not send me anything");
});

//Route handler
app.get('/hihi', function(req, res){
   res.send("Hihi there");
});

//Route handler
app.get('/hello', function(req, res, next){
//   res.send("Hello there"); //We will not do this; we will use middleware
   res.locals.msg += "hello there ";
   next();
});

//Route handler with a parameter: Ex 1
app.get('/reqA/:id([0-9]{5})', function(req, res){
   res.send('id: ' + req.params.id);
});

//Route handler with a parameter: Ex 2
app.get('/reqB/:id([0-9]{5})', function(req, res, next){
   //   res.send('id: ' + req.params.id);
      res.locals.msg += 'id: ' + req.params.id;
      next();
   });
   

// Middleware attached to all routes
app.use(function(req, res, next){
   res.locals.msg += ' Now at Footer ';
   next();
});

// Middleware attached to all routes; Terminates (no "next")
app.use(function(req, res){
   res.locals.msg += 'End';
   res.send(res.locals.msg);
});

app.listen(3000);
