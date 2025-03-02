const express = require('express');
const router = express.Router();
let idList = [];

router.post('/registerPeer', (req, res) => {
    const { peerID } = req.body;
    if (!peerID) {
        return res.status(400).json({ error: 'Peer ID is required' });
    }

    idList.push(peerID);
    console.log(`Peer ID ${peerID} registered. Current list of peers:`, idList);

    res.json({ message: 'Peer registered successfully' });
});

router.get('/getPeers', (req, res) => {
    res.json({ idList });
});

module.exports = router;