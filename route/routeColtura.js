/**
 * Created by dario on 22/06/16.
 */

module.exports = function(apiRoutes, app){

    var User = require('.././model/user');
    var Coltura = require('.././model/colture');
    // var jwt = require('jsonwebtoken');
    //
    // //uncomment to use authentication
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

    apiRoutes.get('/setupColtura',function (req, res) {

        User.findOne({
            token: req.query.token
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'error user Model' });
            } else if (user) {
                var coltura = new Coltura({
                    name: 'margherite',
                    description: "margherite colorate rosse",
                    user: user.id,
                    created_at: new Date(),
                    updated_at: new Date()
                })

                coltura.save(function(err) {
                    if (err) throw err;
                    console.log('User saved successfully');
                    res.json({ success: true });
                });
            }

        });

    })

    apiRoutes.get('/Colture',function (req, res) {

        User.findOne({
            token: req.query.token
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'error user Model' });
            } else if (user) {

                Coltura.find({user : user.id},function(err, colture){
                    res.json(colture)
                })


            }

        });

    })
    apiRoutes.delete('/Coltura/:id',function (req, res) {

        Coltura.findOne({_id : req.params.id},function(err, coltura){
            coltura.remove(function(err,removed) {
                console.log("deleted")
            })
        })

    })

    apiRoutes.post('/Coltura',function (req, res) {

        if (req.body&&(req.query.token||req.body.token)){
            User.findOne({
                token: (req.query.token)?req.query.token:req.body.token
            }, function(err, user) {

                if (err) throw err;

                if (!user) {
                    res.json({ success: false, message: 'error user Model' });
                } else if (user) {
                    var coltura = new Coltura({
                        name: req.body.name,
                        description: req.body.description,
                        user: user.id,
                        updated_at: new Date()
                    })

                    coltura.save(function(err, coltura) {
                        if (err) throw err;
                        console.log('User saved successfully');
                        res.json({ success: true, obj:coltura});
                    });
                }

            });
        }
    })
}