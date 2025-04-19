const express = require('express');
const router = express.Router();
let peers = [];

router.post('/registerPeer', (req, res) => {
    const { peerID, longitude, latitude, role} = req.body;
    if (!peerID || !role) {
        return res.status(400).json({ error: 'Peer ID is required' });
    }
    const existingPeer = peers.find(peer => peer.peerID === peerID);

    if (existingPeer) {
        if (role === "stopIdle") {
            existingPeer.role = "stopIdle";
            return res.status(410).json({error: "Changed role to stopIdle"});
        }
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
    const simplifiedPeers = peers.map(peer => ({
        peerID: peer.peerID,
        role: peer.role
    }));
    res.json({ peers: simplifiedPeers });
});
router.post('/api/getDistance', (req, res) => {
    const { myID, otherID } = req.body;

    const myData = peers.get(myID);
    const otherData = peers.get(otherID);

    if (!myData || !otherData) {
        return res.status(404).json({ error: 'One or both peers not found' });
    }

    const distance = getDistance(myData.latitude, myData.longitude, otherData.latitude, otherData.longitude);
    res.json({ distance });
});

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

module.exports = router;