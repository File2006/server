const express = require('express');
const router = express.Router();
let peers = [];

router.post('/registerPeer', (req, res) => {
    const { peerID, longitude, latitude, role} = req.body;
    if (!peerID || !role) {
        return res.status(400).json({ error: 'Peer ID is required' });
    }
    const exists = peers.some(peer => peer.peerID === peerID);
    if (exists) {
        return res.status(409).json({ error: 'Peer ID already registered' });
    }
    peers.push({peerID, longitude, latitude, role});
    console.log(`Peer ID ${peerID} registered. Current list of peers:`, peers);

    res.json({ message: 'Peer registered successfully' });
});
router.post('/destroyPeer', (req, res) => {
    const { peerID } = req.body;
    if (!peerID) {
        return res.status(400).json({ error: 'Peer ID is required' });
    }
    peers = peers.filter(peer => peer.peerID !== peerID)
    console.log(`Peer ID ${peerID} destroyed. Current list of peers:`, peers);

    res.json({ message: 'Peer destroyed successfully' });
});

router.get('/getPeers', (req, res) => {
    res.json({ peers });
});

module.exports = router;