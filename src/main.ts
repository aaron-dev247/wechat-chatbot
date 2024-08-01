import express from 'express';
import { bot } from './bots/wechat_bot.js';
import { FileBox } from 'file-box';

const app = express();
app.use(express.json()); // To parse JSON bodies

// Get contact by ID
app.get('/contact/:id', async function (req, res) {
    const id = req.params.id;
    const contact = await bot.Contact.find({ id: id });
    if (!contact) {
        res.status(404).send('Contact not found');
        return;
    }
    res.json({ "name": contact.name(), "id": contact.id });
});

// Get room by ID
app.get('/room/:id', async function (req, res) {
    const id = req.params.id;
    const room = await bot.Room.find({ id: id });
    if (!room) {
        res.status(404).send('Room not found');
        return;
    }
    res.json({ "name": await room.topic(), "id": room.id });
});

// Get contact by name
app.get('/contact', async function (req, res) {
    const name = req.query.name;

    if (typeof name !== 'string') {
        res.status(400).send('Invalid contact name');
        return;
    }
    const contact = await bot.Contact.find({ name: name });
    if (!contact) {
        res.status(404).send('Contact not found');
        return;
    }
    res.json({ "name": contact.name(), "id": contact.id });
});

// Get room by name
app.get('/room', async function (req, res) {
    const name = req.query.name;

    if (typeof name !== 'string') {
        res.status(400).send('Invalid room name');
        return;
    }

    const room = await bot.Room.find({ topic: name });
    if (!room) {
        res.status(404).send('Room not found');
        return;
    }
    res.json({ "name": await room.topic(), "id": room.id });
});

// Post text message to contact by ID
app.post('/contact/text/:id', async function (req, res) {
    const id = req.params.id;
    const text = req.body.text;

    const contact = await bot.Contact.find({ id });
    if (!contact) {
        res.status(404).send('Contact not found');
        return;
    }

    await contact.say(text);
    res.send('Text message sent');
});

// Post text message to room by ID
app.post('/room/text/:id', async function (req, res) {
    const id = req.params.id;
    const text = req.body.text;

    const room = await bot.Room.find({ id });
    if (!room) {
        res.status(404).send('Room not found');
        return;
    }

    await room.say(text);
    res.send('Text message sent');
});

// Post file to room by ID
app.post('/contact/file/:id', async function (req, res) {
    const id = req.params.id;
    const fileUrl = req.body.fileUrl;

    const contact = await bot.Contact.find({ id });
    if (!contact) {
        res.status(404).send('Contact not found');
        return;
    }

    const fileBox = FileBox.fromUrl(fileUrl);
    await contact.say(fileBox);
    res.send('File sent');
});

// Post file to room by ID
app.post('/room/file/:id', async function (req, res) {
    const id = req.params.id;
    const fileUrl = req.body.fileUrl;

    const room = await bot.Room.find({ id });
    if (!room) {
        res.status(404).send('Room not found');
        return;
    }

    const fileBox = FileBox.fromUrl(fileUrl);
    await room.say(fileBox);
    res.send('File sent');
});

// Start server
app.listen(3000, () => {
    console.log("Express listening on port 3000");

    bot.start()
        .catch(async e => {
            console.error('Bot start() fail:', e)
            await bot.stop()
            process.exit(-1)
        });
});
