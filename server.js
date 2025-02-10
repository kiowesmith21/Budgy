const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

//"db"
const envelopes = {
    //test data
    "Groceries": {budget: 200},
    "Clothes": {budget: 100}
}

const envelopeExists = name => {
    return envelopes.hasOwnProperty(name);
};

app.get('/', (req, res) => {
    res.send('Budgy, The Envolope Budgeting Widget')
});

app.get('/envelopes', (req, res) => {
    res.json(envelopes);
});

app.get('/envelopes/:name', (req, res) => {
    const envelopeName = req.params.name;  // Extract envelope name from the URL

    if (envelopeExists(envelopeName)) {
        res.json({ name: envelopeName, ...envelopes[envelopeName] });  // Return the envelope data
    } else {
        res.status(404).send(`Error: Envelope "${envelopeName}" not found.`);
    }
});

app.post('/envelopes', (req, res) => {
    const envelopeName = req.body.name;  // Ensure req.body is parsed correctly
    const budget = req.body.budget;

    if (!envelopeName || budget === undefined) {
        return res.status(400).send('Error: "name" and "budget" are required fields.');
    }

    if (envelopeExists(envelopeName)) {
        return res.status(403).send(`Error. Envelope (${envelopeName}) already exists.`);
    }

    envelopes[envelopeName] = { budget };
    res.status(201).send(`New envelope "${envelopeName}" successfully created with budget: ${budget}`);
});

app.put('/envelopes/:name', (req, res) => {
    const envelopeName = req.params.name
    const spent = req.body.spent
    const newBudget = envelopes[envelopeName].budget - spent //new budget based on how much user spent

    if (envelopeExists(envelopeName)) {
        envelopes[envelopeName].budget = newBudget
        res.status(200).send(`Envelope "${envelopeName}" successfully updated. New budget: ${newBudget}`)
    } else {
        res.status(404).send(`Error: Envelope "${envelopeName}" not found.`);
    }
});

app.post('/envelopes/transfer/:from/:to', (req, res) => {
    const from = req.params.from
    const to = req.params.to
    const amount = req.body.amount

    //if 'from' or 'to does not exist
    if (!envelopeExists(from)) {
        res.status(404).send(`Error: Envelope "${from}" not found.`);
    } else if (!envelopeExists(to)){
        res.status(404).send(`Error: Envelope "${to}" not found.`);

    } else {
        const newFromBudget = envelopes[from].budget - amount
        const newToBudget = envelopes[to].budget + amount
        envelopes[from].budget = newFromBudget
        envelopes[to].budget = newToBudget
        res.status(200).send(`Envelopes successfully updated. "${from}" new budget: ${newFromBudget}. "${to}" new budget: ${newToBudget}`)
    }
});

app.delete('/envelopes/:name', (req, res) => {
    const envelopeName = req.params.name

    if (envelopeExists(envelopeName)) {
        delete envelopes[envelopeName]
        res.status(200).send(`Envelope "${envelopeName}" successfully deleted.`)
    } else {
        res.status(404).send(`Error: Envelope "${envelopeName}" not found.`);
    }
});

app.listen(port, () => {
    console.log(`Budgy listening on port ${port}`)
});