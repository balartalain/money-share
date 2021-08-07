const {Router} = require('express')
const router = Router();
const admin = require('firebase-admin');

var serviceAccount = require("../../money-share-59f87-firebase-adminsdk-py96k-d961d5dbcc.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://money-share-59f87-default-rtdb.firebaseio.com/'
})

const db = admin.database();
router.use(function (req, res, next) {
    req.query.db = (!req.query.env || req.query.env === 'PRODUCTION')?"":"test/"; 
    next();
  });

router.get('/', (req, res) => {
    res.json({
        env: req.query.env,
        db: req.query.db
    });
});
// Register user
router.put('/api/:userId/register-user/', (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email || ''
    }  
    const firebaseDB = req.query.db;
    const refDay = db.ref(`${firebaseDB}users/${req.params.userId}`);
    refDay.set(user).then(()=>{
        res.json(user);
    }).catch((error) => {
        res.json(error);
    })
});
router.get('/api/get-users/', (req, res) => {
    const firebaseDB = req.query.db;
    db.ref(`${firebaseDB}users`).once("value", function(snapshot) {
        if (snapshot.val() == null) {    
            res.json({});        
        } else {        
            res.json(snapshot.val());        
        }
    })
})
// Get user data
router.get('/api/:userId/get-data/', (req, res) => {
    const firebaseDB = req.query.db;
    db.ref(`${firebaseDB}data/${req.params.userId}`).once("value", function(snapshot) {
        if (snapshot.val() == null) {    
            res.json({});        
        } else {        
            res.json(snapshot.val());        
        }
    })
});

// Add new / update expense
router.put('/api/:userId/add-expense/', (req, res) => {
    const expense = {
        amount: req.body.amount,
        currency: req.body.currency,
        concept: req.body.concept,
        comment: req.body.comment || "",
        updated: req.body.updated
    }  
    const firebaseDB = req.query.db;
    const refDay = db.ref(`${firebaseDB}data/${req.params.userId}/${req.body.year}/${req.body.month}/${req.body.day}/${req.body.created}`);
    refDay.set(expense).then(()=>{
        res.json(expense);
    }).catch((error) => {
        res.json(error);
    })
});
// Update Expense
router.put('/api/:userId/update-expense/', (req, res) => {
    const expense = {
        amount: req.body.amount,
        currency: req.body.currency,
        concept: req.body.concept,
        comment: req.body.comment || {},
        updated: req.body.updated
    }
    const firebaseDB = req.query.db;
    const refDay = db.ref(`${firebaseDB}data/${req.params.userId}/${req.body.year}/${req.body.month}/${req.body.day}/${req.body.created}`);
    refDay.set(expense).then(()=>{
        res.json(expense);
    }).catch((error) => {
        res.json(error);
    })
});

// Delete expense
router.put('/api/:userId/delete-expense/', (req, res) => {

    const firebaseDB = req.query.db;
    const refDay = db.ref(`${firebaseDB}data/${req.params.userId}/${req.body.year}/${req.body.month}/${req.body.day}/${req.body.created}`);
    refDay.update({'deleted': 'true'}).then(()=>{
        res.json('success');
    }).catch((error) => {
        res.json(error);
    })
});

// Set Supervisor
router.put('/api/:userId/set-supervisor/', (req, res) => {
    const firebaseDB = req.query.db;
    const refDay = db.ref(`${firebaseDB}users/${req.params.userId}`);
    refDay.update({'supervisor': req.body.isSupervisor}).then(()=>{
        res.json('success');
    }).catch((error) => {
        res.json(error);
    })
});

// router.post('/api/users/add/', (req, res) => {
//     const user = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName
//     }
//     const newEntry = db.ref('users').push();
//     newEntry.set(user).then(()=>{
//         console.log(newEntry)
//         res.json('Ok');
//     }).catch((error) => {
//         console.log(error);
//         res.json(error);
//     })
// });
module.exports = router;