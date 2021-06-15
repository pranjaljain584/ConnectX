const express = require('express');
const router = express.Router();
const {saveCallId , getCallId} = require('../../models/model') ;

router.post('/save-call-id',async (req,res)=>{
    try {
        const {roomId,signalData} = req.body ;

        await saveCallId(roomId,signalData) ;
        res.status(200).send(true) ;

    } catch (error) {
        res.status(400).send(error.message) ;
    }
}) ;

router.get('/get-call-id/:roomId',async (req,res)=>{
    try {
        const {roomId} = req.params ;
        // console.log(roomId) ;
        const code = await getCallId(roomId) ;
        // console.log(code) ;
        res.status(200).send({code}) ;
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = router;
