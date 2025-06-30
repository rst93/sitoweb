const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const plansDir = path.join(__dirname, 'plans');
if (!fs.existsSync(plansDir)) {
    fs.mkdirSync(plansDir);
}

app.post('/save-plan', (req, res) => {
    const plan = req.body;
    if (!plan.name) {
        return res.status(400).json({ message: 'Plan name is required' });
    }
    const planName = plan.name.replace(/\s+/g, '-').toLowerCase();
    const filePath = path.join(plansDir, `${planName}.json`);

    fs.writeFile(filePath, JSON.stringify(plan, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error saving plan' });
        }
        res.json({ message: 'Plan saved successfully' });
    });
});

app.get('/get-plans', (req, res) => {
    fs.readdir(plansDir, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error getting plans');
        }
        const plans = files.map(file => {
            const filePath = path.join(plansDir, file);
            const data = fs.readFileSync(filePath);
            return JSON.parse(data);
        });
        res.json(plans);
    });
});

app.delete('/delete-plan/:planName', (req, res) => {
    const planName = req.params.planName;
    console.log('Attempting to delete plan:', planName);
    const filePath = path.join(plansDir, `${planName}.json`);
    console.log('File path to delete:', filePath);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: 'Error deleting plan', error: err });
        }
        console.log('Plan deleted successfully:', planName);
        res.json({ message: 'Plan deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});