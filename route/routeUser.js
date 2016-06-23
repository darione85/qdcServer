/**
 * Created by dario on 22/06/16.
 */

module.exports = function(apiRoutes,app){

    var User = require('.././model/user');
    var jwt = require('jsonwebtoken');


    //uncomment to use authentication
    // apiRoutes.use(function(req, res, next) {
    //
    //     // check header or url parameters or post parameters for token
    //
    //     var token = req.body.token || req.query.token || req.headers['x-access-token'];
    //
    //     // decode token
    //     if (token) {
    //
    //         // verifies secret and checks exp
    //         jwt.verify(token, app.get('superSecret'), function(err, decoded) {
    //             if (err) {
    //                 return res.json({ success: false, message: 'Failed to authenticate token.' });
    //             } else {
    //                 // if everything is good, save to request for use in other routes
    //                 req.decoded = decoded;
    //                 next();
    //             }
    //         });
    //
    //     } else {
    //
    //         // if there is no token
    //         // return an error
    //         return res.status(403).send({
    //             success: false,
    //             message: 'No token provided.'
    //         });
    //
    //     }
    // });

// route to show a random message (GET http://localhost:8080/api/)
// ...

// route to return all users (GET http://localhost:8080/api/users)
    apiRoutes.get('/users', function(req, res) {

        User.find({}, function(err, users) {
            res.json(users);
        });
    });

    apiRoutes.get('/user', function(req, res) {

        User.findOne({
            token: req.query.token
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'error user Model' });
            } else if (user) {
                res.json(user)
            }

        });


    });

    apiRoutes.get('/test', function(req, res) {
        res.json({
            type:'secceded'
        })
    })



}