const {Router} = require('express')
const router = Router();
const admin = require('firebase-admin');

var serviceAccount = require("../../money-share-59f87-firebase-adminsdk-py96k-d961d5dbcc.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://money-share-59f87-default-rtdb.firebaseio.com/'
})

const db = admin.database();
router.get('/', (req, res) => {
    res.json('Ok');
});

// Get user data
router.get('/api/:userId/get-data/', (req, res) => {
    console.log(req.params)
    db.ref('users/'+req.params.userId).once("value", function(snapshot) {
        if (snapshot.val() == null) {    
            res.json({});        
        } else {        
            res.json({"data": snapshot.val()});        
        }
    })
});

// Add new expense
router.post('/api/:userId/add-expense/', (req, res) => {
    const expense = {
        amount: req.body.amount,
        currency: req.body.currency,
        concept: req.body.concept,
        comment: req.body.comment || "",
        updated: req.body.created
    }
    const refDay = db.ref(`users/${req.params.userId}/${req.body.year}/${req.body.month}/${req.body.day}/${req.body.created}`);
    refDay.set(expense).then(()=>{
        res.json({data: expense});
    }).catch((error) => {
        res.json(error);
    })
});
// Update Expense
router.post('/api/:userId/update-expense/', (req, res) => {
    const expense = {
        amount: req.body.amount,
        currency: req.body.currency,
        concept: req.body.concept,
        comment: req.body.comment || {},
        updated: req.body.updated
    }
    const refDay = db.ref(`users/${req.params.userId}/${req.body.year}/${req.body.month}/${req.body.day}/${req.body.created}`);
    refDay.set(expense).then(()=>{
        res.json('success');
    }).catch((error) => {
        res.json(error);
    })
});

// Delete expense
router.post('/api/:userId/delete-expense/', (req, res) => {

    const refDay = db.ref(`users/${req.params.userId}/${req.body.year}/${req.body.month}/${req.body.day}/${req.body.created}`);
    refDay.update({'delete': true}).then(()=>{
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