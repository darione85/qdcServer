/**
 * Created by dario on 21/06/16.
 */

//mongo -u dario -p dario4cima --authenticationDatabase admin

/**
 * db.createUser({ user: "dario", pwd: "dario4cima",
        roles: [ { role: "userAdminAnyDatabase", db: "admin" }]
})
 */

//library
var _ = require("underscore")
var express = require('express');
//lets require/import the mongodb native drivers.
//var mongodb = require('mongodb');
//
//read and write file
var jsonfile = require('jsonfile')
var util = require('util')
var fs = require('fs')
var CronJob = require('cron').CronJob;

var config = require('./config');

var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
    ObjectId = Schema.ObjectId;



//init app
var app = express();

var apiRoutes = express.Router();

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true,
    limit: '50mb'
}));

apiRoutes.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true,
    limit: '50mb'
}));


mongoose.connect(config.database);

app.set('superSecret', config.secret);

//MODEL

var User = require('./model/user');
var Coltura = require('./model/colture');

require('./route/routeColtura')(apiRoutes,app);
require('./route/routeUser')(apiRoutes,app);

var middleware = require('./middleware/middleware')

apiRoutes.use(middleware.verifyToken)


var lavoriSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    user:{ type: ObjectId, ref:'userSchema'},
    created_at: Date,
    updated_at: Date
});

var prodottiSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    user:{ type: ObjectId, ref:'userSchema'},
    created_at: Date,
    updated_at: Date
});

var terreniSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    user:{ type: ObjectId, ref:'userSchema'},
    created_at: Date,
    updated_at: Date
});

var unitaSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    factor:Number,
    created_at: Date,
    updated_at: Date
});

var trattamentiSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    user:{ type: ObjectId, ref:'userSchema'},
    coltura:{ type: ObjectId, ref:'coltureSchema'},
    terreno:{ type: ObjectId, ref:'terreniSchema'},
    lavoro:{ type: ObjectId, ref:'lavoriSchema'},
    time: Number,
    date: Date,
    created_at: Date,
    updated_at: Date
});

var trattamentiProdottiSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    prodotto:{ type: ObjectId, ref:'prodottiSchema'},
    user:{ type: ObjectId, ref:'userSchema'},
    quantita: Number,
    trattamento: { type: ObjectId, ref:'trattamentiSchema'},
    time: Number,
    date: Date,
    unita: { type: ObjectId, ref:'unitaSchema'},
    created_at: Date,
    updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
// var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
// module.exports = User;

//END MODEL



app.set('view engine', 'ejs');

var uuid = require('uuid');

app.use('/bower_components', express.static('bower_components'));

app.use('/js', express.static('js'));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours

    res.setHeader('content-type', 'application/json')

    // Pass to next layer of middleware
    next();
});







//end Authenticated routs

app.listen(8082, function () {
    console.log('listening on port 8082!');
});

app.post('/login',function (req, res) {

    var username = req.body.username
    var password = req.body.password

    User.find({username: username}, function (err, users) {
        if(users.password == password){

        }
    })


    User.find({}, function(err, users) {
        res.json(users);
    });
})

app.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({
        username: req.query.username
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.query.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'),{expiresIn: '500m'});

                user.token = token

                user.save(function(err) {
                    if (err)
                        console.log('error')
                    else
                        console.log('success')
                });
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});


app.post('/setupAdmin',function (req, res) {
    var user1 = new User({
        name: 'admin',
        username: 'admin',
        password: 'admin4cima',
        email:'dario.rubado@gmail.com',
        token : 'xxxx',
        admin: true,
        location: 'ceriale',
        meta: {
            age: 31,
            website: "www.karuweb.it"
        }
    })

    user1.save(function(err) {
        if (err) throw err;
        console.log('User saved successfully');
        res.json({ success: true });
    });


})

app.post('/setupUser',function (req, res) {
    var user1 = new User({
        name: 'user',
        username: 'user',
        password: 'user4cima',
        email:'user@gmail.com',
        token : 'xxxx',
        admin: false,
        location: 'ceriale',
        meta: {
            age: 31,
            website: "www.karuweb.it"
        }
    })

    user1.save(function(err) {
        if (err) throw err;
        console.log('User saved successfully');
        res.json({ success: true });
    });


})






app.get('/login', function(req, res) {
    // var UserModel = mongoose.model('UserModel', userSchema)

    var user = new UserModel({
        name: 'admin',
        username: 'admin',
        password: 'admin4cima',
        email:'dario.rubado@gmail.com',
        token : 'xxxx',
        admin: true,
        location: 'ceriale',
        meta: {
            age: 31,
            website: "www.karuweb.it"
        }
    })

    user.name = "admin"
    user.mail = "dario.rubado@gmail.com";
    user.password = "dario4cima";
    user.save(function () {
        res.send(req.body);
    });
});



//vecchia app

// app.post('/savemap', function (req, res) {
//
//     //var date = new Date()
//     /*var fileName = date.getTime();*/
//     var fileName = uuid.v4();//Generate and return a RFC4122 v4 UUID.
//     //console.dir(JSON.parse(req.body.text));
//     try {
//         //var mapObj = JSON.parse(req.body);
//         var mapObj = req.body;
//     }catch (err){
//         console.log(err)
//     }
//
//     if (_.isObject(mapObj)){
//         var response = {
//             printId: fileName,
//         }
//
//         var file = 'temp/'+fileName+'.json'
//         //rimuovo apici
//         var objStringified = JSON.stringify(mapObj).replace(/'/g, "")
//         mapObj = JSON.parse(objStringified)
//
//         jsonfile.writeFile(file, mapObj, function (err) {
//             console.error(err)
//             if (err){
//                 res.writeHead(404);
//                 res.end("error1");
//             }else{
//                 res.send(response);
//             }
//         })
//
//         //res.send(response);
//
//     }else{
//         res.writeHead(404);
//         res.end("error1");
//     }
// });
//
// app.get('/getmap/:mid', function (req, res) {
//
//     try {
//         var mapId = req.params.mid;
//
//     }catch (err){
//         console.log(err)
//     }
//     if(mapId!= null){
//         var filename = 'temp/'+mapId+'.json'
//         jsonfile.readFile(filename, function (err, obj) {
//             if (err){
//                 res.writeHead(404);
//                 res.end("error1");
//             }else{
//                 res.send(obj);
//             }
//         })
//     }else{
//         res.writeHead(404);
//         res.end("error2");
//     }
// })
//
//
//
// app.get('/paintmap/:mid/:template?', function(req, res) {
//     var mid = req.params.mid
//     var template = null
//
//     try{
//         if(req.params.template)template = req.params.template
//
//     } catch (err){
//         console.log(err)
//     }
//
//
//
//     if(mid!= null){
//         var filename = 'temp/'+mid+'.json'
//         jsonfile.readFile(filename, function (err, obj) {
//             console.dir(obj)
//             if(err){
//                 res.writeHead(404);
//                 res.end("error2");
//             }else{
//                 res.setHeader('content-type', 'text/html')
//
//                 //choose template
//
//                 if (template == null){
//                     var baseTemplate ='mapPainter/index';
//                 }else{
//                     var baseTemplate ='mapPainter/'+template;
//                 }
//
//                 res.render(baseTemplate, {
//                     mapId: obj
//                 });
//             }
//         });
//     }else{
//         res.writeHead(404);
//         res.end("error2");
//     }
//     //res.sendFile('/home/dario/nodejs/public/mapPainter/index.ejs'); // load the single view file (angular will handle the page changes on the front-end)
// });
//
//
// app.get('/maplist', function(req, res) {
//     fs.readdir('temp/',function (err, files){
//
//         if (err){
//             res.writeHead(404);
//             res.end("error2");
//         }else{
//             var template = 'mapPainter/list'
//
//             if(files.length > 0 ){
//                 res.setHeader('content-type', 'text/html')
//                 res.render(template, {
//                     files: files
//                 });
//             }
//         }
//     });
// })
//
// var job = new CronJob('00 30 23 * * 6', function() {
//         /*
//          * Runs saturday
//          * at 23:30:00
//          *
//          */
//
//         fs.readdir('temp/',function (err, files){
//             files.forEach(function(file){
//                 fs.unlink('temp/'+file);
//             });
//         });
//
//     }, function () {
//         /* This function is executed when the job stops */
//         logger("cartella pulita")
//
//     },
//     true, /* Start the job right now */
//     'Europe/Rome' /* Time zone of this job. */
// );
//
//
// function logger(log){
//
//     fs.readdir('log/',function (err, files){
//
//         var file = 'log/log.'+files.lenght+'.log'
//
//         fs.writeFile(file, log, function (error) {
//             console.error(error);
//         })
//
//     });
//
// }


