/**
 * Created by dario on 22/06/16.
 */

module.exports = function(apiRoutes,app){

    var User = require('.././model/user');

    apiRoutes.get('/users', function(req, res) {

        User.find({}, function(err, users) {
            res.json(users);
        });
    });

    apiRoutes.get('/user/:name', function(req, res) {

        User.findOne({
            name: req.params.name
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