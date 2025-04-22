const express = require('express');
const router = express.Router();
let peers = [];

// Endpoint pro registraci nového peeru
router.post('/registerPeer', (req, res) => {
    const { peerID, longitude, latitude, role} = req.body;
    if (!peerID || !role) {
        return res.status(400).json({ error: 'Peer ID is required' });
    }
    const existingPeer = peers.find(peer => peer.peerID === peerID);
    if (existingPeer) {
        return res.status(409).json({ error: 'Peer ID already registered' });
    }
    peers.push({peerID, longitude, latitude, role});
    console.log(`Peer ID ${peerID} registered. Current list of peers:`, peers);

    res.json({ message: 'Peer registered successfully' });
});

// Endpoint pro odstranění peeru
router.post('/destroyPeer', (req, res) => {
    const { peerID } = req.body;
    if (!peerID) {
        return res.status(400).json({ error: 'Peer ID is required' });
    }
    peers = peers.filter(peer => peer.peerID !== peerID)
    console.log(`Peer ID ${peerID} destroyed. Current list of peers:`, peers);

    res.json({ message: 'Peer destroyed successfully' });
});

// Endpoint pro získání seznamu peerů
router.get('/getPeers', (req, res) => {
    const simplifiedPeers = peers.map(peer => ({
        peerID: peer.peerID,
        role: peer.role
    }));
    res.json({ peers: simplifiedPeers });
});

// Endpoint pro aktualizaci role peeru
router.post('/updatePeerRole', (req, res) => {
    const { peerID, role } = req.body;
    if (!peerID || !role) {
        return res.status(400).json({ error: 'Peer ID and new role are required' });
    }

    const peer = peers.find(peer => peer.peerID === peerID);

    if (!peer) {
        return res.status(404).json({ error: 'Peer not found' });
    }

    peer.role = role;
    console.log(`Peer ID ${peerID} role updated to ${role}. Current list of peers:`, peers);

    res.json({ message: `Peer ID ${peerID} role updated to ${role} successfully` });
});

// Endpoint pro výpočet vzdálenosti mezi dvěma peery
router.post('/getDistance', (req, res) => {
    const { callerID, destID } = req.body;

    const myData = peers.find(peer => peer.peerID === callerID);
    const otherData = peers.find(peer => peer.peerID === destID);

    if (!myData || !otherData) {
        return res.status(404).json({ error: 'One or both peers not found' });
    }
    console.log(myData.latitude, myData.longitude, otherData.latitude, otherData.longitude);
    const distance = getDistance(myData.latitude, myData.longitude, otherData.latitude, otherData.longitude);
    console.log(distance);
    res.json({ distance });
});

// Funkce pro výpočet vzdálenosti mezi dvěma body na základě zeměpisných souřadnic (Harvesinův vzorec)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
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