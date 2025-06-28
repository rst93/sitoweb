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
        return res.status(400).send('Plan name is required');
    }
    const planName = plan.name.replace(/\s+/g, '-').toLowerCase();
    const filePath = path.join(plansDir, `${planName}.json`);

    fs.writeFile(filePath, JSON.stringify(plan, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving plan');
        }
        res.send('Plan saved successfully');
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});