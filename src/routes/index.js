const {Router} = require('express')
const router = Router();
const admin = require('firebase-admin');

var serviceAccount = require("../../money-share00-firebase-adminsdk-qcs9h-95ba404677.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://money-share00-default-rtdb.firebaseio.com/'
})

const db = admin.database();
router.get('/', (req, res) => {
    res.json('Ok');
});
router.get('/api/users/', (req, res) => {
    db.ref('users').once("value", function(snapshot) {
        if (snapshot.val() == null) {    
            res.json({message: "Error: No user found", "result": false});        
        } else {        
            res.json({"message":"successfully fetch data", "result": true, "data": snapshot.val()});        
        }
    })
});

router.post('/api/users/add/', (req, res) => {
    const user = {
        firstName: req.body.firstName,
        email: req.body.email
    }
    db.ref('users').push({firstName:'Hugo', lastName: 'faselo'});
});
module.exports = router;