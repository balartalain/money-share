const {Router} = require('express')
const router = Router();
const admin = require('firebase-admin');

var serviceAccount = require("../../money-share00-firebase-adminsdk-qcs9h-95ba404677.json");
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
    db.ref('users/'+req.params.id).once("value", function(snapshot) {
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
        concept: req.body.concept,
        comment: req.body.comment,
        updated: req.body.created
    }
    const refDay = db.child(`${req.params.userId}/
                             ${req.params.year}/
                             ${req.params.month}/
                             ${req.params.day}`);
    refDay.set(expense).then(()=>{
        res.json('success');
    }).catch((error) => {
        res.json(error);
    })
});
// Update/Delete expense
router.post('/api/:userId/update-expense/', (req, res) => {
    const expense = {
        amount: req.body.amount,
        concept: req.body.concept,
        comment: req.body.comment,
        updated: req.body.created
    }
    if (req.body.delete){
        expense.delete = true;
    }
    const refDay = db.child(`${req.params.userId}/
                             ${req.params.year}/
                             ${req.params.month}/
                             ${req.params.day}`);
    refDay.set(expense).then(()=>{
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