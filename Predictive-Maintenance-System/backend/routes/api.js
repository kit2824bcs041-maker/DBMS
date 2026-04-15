const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Health Check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

// Helper for Mock Data
function getMockReadings() {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 20; i++) {
        data.push({
            timestamp: new Date(now.getTime() - (20 - i) * 60000).toISOString(),
            temperature: 65 + Math.random() * 25, // 65-90 Range
            vibration: 0.5 + Math.random() * 2.5 // 0.5-3.0 Range
        });
    }
    return data;
}

// Get Sensor Readings
router.get('/readings', async (req, res) => {
    try {
        // Fallback to Mock if DB not reachable
        res.json({ data: getMockReadings() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get Anomalies
router.get('/anomalies', async (req, res) => {
    try {
        // Return simulated anomalies
        const anomalies = [
            { id: 101, device: 'Pump A', issue: 'High Vibration Detected (3.2g)', time: new Date().toISOString(), status: 'Active' },
            { id: 102, device: 'Compressor B', issue: 'Temperature Spike (> 85°C)', time: new Date(Date.now() - 3600000).toISOString(), status: 'Resolved' }
        ];
        res.json({ data: anomalies });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
