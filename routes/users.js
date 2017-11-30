let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
let User = require('../model/users');

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Welcome!'});
});

router.get('/register', function (req, res, next) {
    res.render('register', {title: 'Welcome!'});
});

router.post('/register', function (req, res, next) {

    bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) {
            res.status(500);
            res.json({
                'status': 500,
                'message': 'Error in generating hash',
                'err': err,
                'api': req.originalUrl
            });
        } else {
            req.body.password = hash;
            /*** save the user ***/
            User(req.body).save(function (err) {
                if (err) {
                    switch (err.code) {
                        case 11000:
                            res.status(500);
                            res.json({
                                'status': 500,
                                'message': 'Username already exists.Try another one.',
                                err: err.code
                            });
                            break;
                        default:
                            res.status(500);
                            res.json({
                                'status': 500,
                                'message': 'Error in saving user information',
                                'err': err,
                                'api': req.originalUrl
                            });
                    }
                } else {
                    res.json({
                        'status': 200,
                        'message': 'User created successfully'
                    });
                }
            });
        }
    });
});

router.post('/login', function (req, res, next) {

    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if(err){
            res.status(500);
            res.json({
                'status': 500,
                'message': 'Error in generating hash',
                'err': err,
                'api': req.originalUrl
            });
        } else{
            User.findOne({email: req.params.email, password: hash ,is_deleted: false}, {'password': false}, function (err, user) {
                console.log(user);
                if (err) {
                    switch (err.code) {
                        case 11000:
                            res.status(500);
                            res.json({
                                'status': 500,
                                'message': 'Username already exists.Try another one.',
                                err: err.code
                            });
                            break;
                        default:
                            res.status(500);
                            res.json({
                                'status': 500,
                                'message': 'Error in saving user information',
                                'err': err,
                                'api': req.originalUrl
                            });
                    }
                } else {
                    if (null === user) {
                        res.json({
                            'status': 404,
                            'message': 'User not found',
                        });
                    } else {

                        res.json({
                            'status': 200,
                            'message': 'User found' ,
                            user: user
                        });
                    }
                }
            });
        }
    });
});

router.put('/:id', function (req, res, next) {
    /** find user and update at same time if found **/
    User.findOneAndUpdate({_id: req.params.id, is_deleted: false}, req.body).lean().exec(function (err, user) {
        if (err) {
            res.status(500);
            res.json({
                'status': 500,
                'message': 'Error in finding/updating user information',
                'err': err,
                'api': req.originalUrl
            });
            return false;
        } else if (null == user) {
            res.json({
                'status': 404,
                'message': 'User not found'
            });
            return false;
        } else {
            res.json({
                'status': 200,
                'message': 'User updated successfully'
            });
        }
    });
});

router.delete('/:id', function (req, res, next) {
    let queryObj = {_id: req.params.id},
        updateObj = {is_deleted: true};
    User.findOneAndUpdate(queryObj, updateObj).lean().exec(function (err, user) {
        if (err) {
            res.status(500);
            res.json({
                'status': 500,
                'message': 'users information not available',
                'err': err,
                'api': req.originalUrl
            });
        } else if (!user) {
            res.json({
                'status': 404,
                'message': 'User not found'
            });
            return false;
        } else {
            res.json({
                'status': 200,
                'message': 'User deleted successfully'
            });
        }
    });
});

router.get('/get', function (req, res, next) {
    User.find({is_deleted: false}, {'password': false}, function (err, users) {
        if (err) {
            res.status(500);
            res.json({
                'status': 500,
                'message': 'users information not available',
                'err': err,
                'api': req.originalUrl
            });
        } else {
            if (null == users) {
                res.json({
                    'status': 404,
                    'message': 'No User Found',
                });
            } else {
                res.json({
                    'status': 200,
                    'message': users.length > 1 ? (users.length + ' users found') : (users.length + ' user found'),
                    users: users
                });
            }
        }
    });
});

router.get('/get/:id', function (req, res, next) {
    User.findOne({_id: req.params.id, is_deleted: false}, {'password': false}, function (err, user) {
        if (err) {
            res.status(500);
            res.json({
                'status': 500,
                'message': 'user information not available',
                'err': err,
                'api': req.originalUrl
            });
        } else {
            if (null === user) {
                res.json({
                    'status': 404,
                    'message': 'User not found',
                });
            } else {

                res.json({
                    'status': 200,
                    'message': 'User found' ,
                    user: user
                });
            }
        }

    });
});

module.exports = router;