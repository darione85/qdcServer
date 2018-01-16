/**
 * Created by dario on 22/06/16.
 */

module.exports = function(apiRoutes, app){

    var User = require('.././model/user');
    var Lavoro = require('.././model/lavori');

    //get lavori by username
    apiRoutes.get('/lavori/:usernameId', function (req, res) {
        var username = req.params.usernameId

        if (username){
            User.findOne({
                _id: username
            }, function(err, user) {

                if (err) throw err;

                if (!user) {
                    res.json({ success: false, message: 'error user Model' });
                } else if (user) {
                    Lavoro.find({user: user._id}, function (err, lavori) {
                        res.json(lavori);
                    })
                }

            });
        }
    })

    apiRoutes.get('/lavoro/:id', function (req, res) {
        var id = req.params.id

        Lavoro.findOne({_id : id}, function(err, lavoro){
            if (err) throw err;
            else{
                res.json(lavoro);
            }
        });
    })

    apiRoutes.delete('/lavoro/:id', function (req, res) {

        var id = req.params.id

        Lavoro.remove({_id : id}, function(err){
            if (err) throw err;
            else{
                console.log('Lavoro Cancellato');
                res.json({ success: true});
            }
        });
    })

    apiRoutes.put('/lavoro/:id', function (req, res) {

        // {
        //     "name": "spuntatura update",
        //     "description": "spuntatura leggera update"
        // }

        if (!(req.params.id && req.body.name && req.body.description)) res.json({ success: false, error: "parametro mancante"});

        var id = req.params.id
        var name = req.body.name.trim()
        var description = req.body.description.trim()

        Lavoro.findOne({_id : id}, function(err, lavoro){
            if (err) throw err;
            else{
                lavoro.name = name;
                lavoro.description = description;
                lavoro.updated_at = new Date();

                lavoro.save(function(err, lavoro) {
                    if (err) throw err;
                    console.log('lavoro aggiornato');
                    res.json({ success: true,id : lavoro.id});
                });
            }
        });
    })
    
    apiRoutes.post('/lavoro', function (req, res) {

        if (!(req.body.username && req.body.name && req.body.description)) res.json({ success: false, error: "parametro mancante"});

        var username = req.body.username
        var name = req.body.name.trim()
        var description = req.body.description.trim()

        if(username){
            if (username){
                User.findOne({
                    username: username
                }, function(err, user) {

                    if (err) throw err;

                    if (!user) {
                        res.json({ success: false, message: 'error user Model' });
                    } else if (user) {

                        var lavoro = new Lavoro({
                                            name: name,
                                            description: description,
                                            user: user.id,
                                            created_at: new Date(),
                                            updated_at: new Date()
                                        })

                        lavoro.save(function(err, lavoro) {
                                            if (err) throw err;
                                            console.log('Nuovo lavoro Salvato');
                                            res.json({ success: true,id : lavoro.id});
                                        });
                    }

                });
            }
        }else res.json({ error: "username not set"});
        
    })

    // apiRoutes.get('/setupColtura',function (req, res) {
    //
    //     User.findOne({
    //         token: req.query.token
    //     }, function(err, user) {
    //
    //         if (err) throw err;
    //
    //         if (!user) {
    //             res.json({ success: false, message: 'error user Model' });
    //         } else if (user) {
    //             var coltura = new Coltura({
    //                 name: 'margherite',
    //                 description: "margherite colorate rosse",
    //                 user: user.id,
    //                 created_at: new Date(),
    //                 updated_at: new Date()
    //             })
    //
    //             coltura.save(function(err) {
    //                 if (err) throw err;
    //                 console.log('User saved successfully');
    //                 res.json({ success: true });
    //             });
    //         }
    //
    //     });
    //
    // })
    //
    // apiRoutes.get('/Colture',function (req, res) {
    //
    //     User.findOne({
    //         token: req.query.token
    //     }, function(err, user) {
    //
    //         if (err) throw err;
    //
    //         if (!user) {
    //             res.json({ success: false, message: 'error user Model' });
    //         } else if (user) {
    //
    //             Coltura.find({user : user.id},function(err, colture){
    //                 res.json(colture)
    //             })
    //
    //
    //         }
    //
    //     });
    //
    // })
    // apiRoutes.delete('/Coltura/:id',function (req, res) {
    //
    //     Coltura.findOne({_id : req.params.id},function(err, coltura){
    //         coltura.remove(function(err,removed) {
    //             console.log("deleted")
    //         })
    //     })
    //
    // })
    //
    // apiRoutes.post('/Coltura',function (req, res) {
    //
    //     if (req.body&&(req.query.token||req.body.token)){
    //         User.findOne({
    //             token: (req.query.token)?req.query.token:req.body.token
    //         }, function(err, user) {
    //
    //             if (err) throw err;
    //
    //             if (!user) {
    //                 res.json({ success: false, message: 'error user Model' });
    //             } else if (user) {
    //                 var coltura = new Coltura({
    //                     name: req.body.name,
    //                     description: req.body.description,
    //                     user: user.id,
    //                     updated_at: new Date()
    //                 })
    //
    //                 coltura.save(function(err, coltura) {
    //                     if (err) throw err;
    //                     console.log('User saved successfully');
    //                     res.json({ success: true, obj:coltura});
    //                 });
    //             }
    //
    //         });
    //     }
    // })
}


