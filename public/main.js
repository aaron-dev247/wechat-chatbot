"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wechat_bot_js_1 = require("./bots/wechat_bot.js");
const file_box_1 = require("file-box");
const app = (0, express_1.default)();
app.use(express_1.default.json()); // To parse JSON bodies
// Get contact by ID
app.get('/contact/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const contact = yield wechat_bot_js_1.bot.Contact.find({ id: id });
        if (!contact) {
            res.status(404).send('Contact not found');
            return;
        }
        res.json({ "name": contact.name(), "id": contact.id });
    });
});
// Get room by ID
app.get('/room/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const room = yield wechat_bot_js_1.bot.Room.find({ id: id });
        if (!room) {
            res.status(404).send('Room not found');
            return;
        }
        res.json({ "name": yield room.topic(), "id": room.id });
    });
});
// Get contact by name
app.get('/contact', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = req.query.name;
        if (typeof name !== 'string') {
            res.status(400).send('Invalid contact name');
            return;
        }
        const contact = yield wechat_bot_js_1.bot.Contact.find({ name: name });
        if (!contact) {
            res.status(404).send('Contact not found');
            return;
        }
        res.json({ "name": contact.name(), "id": contact.id });
    });
});
// Get room by name
app.get('/room', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = req.query.name;
        if (typeof name !== 'string') {
            res.status(400).send('Invalid room name');
            return;
        }
        const room = yield wechat_bot_js_1.bot.Room.find({ topic: name });
        if (!room) {
            res.status(404).send('Room not found');
            return;
        }
        res.json({ "name": yield room.topic(), "id": room.id });
    });
});
// Post text message to contact by ID
app.post('/contact/text/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const text = req.body.text;
        const contact = yield wechat_bot_js_1.bot.Contact.find({ id });
        if (!contact) {
            res.status(404).send('Contact not found');
            return;
        }
        yield contact.say(text);
        res.send('Text message sent');
    });
});
// Post text message to room by ID
app.post('/room/text/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const text = req.body.text;
        const room = yield wechat_bot_js_1.bot.Room.find({ id });
        if (!room) {
            res.status(404).send('Room not found');
            return;
        }
        yield room.say(text);
        res.send('Text message sent');
    });
});
// Post file to room by ID
app.post('/contact/file/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const fileUrl = req.body.fileUrl;
        const contact = yield wechat_bot_js_1.bot.Contact.find({ id });
        if (!contact) {
            res.status(404).send('Contact not found');
            return;
        }
        const fileBox = file_box_1.FileBox.fromUrl(fileUrl);
        yield contact.say(fileBox);
        res.send('File sent');
    });
});
// Post file to room by ID
app.post('/room/file/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const fileUrl = req.body.fileUrl;
        const room = yield wechat_bot_js_1.bot.Room.find({ id });
        if (!room) {
            res.status(404).send('Room not found');
            return;
        }
        const fileBox = file_box_1.FileBox.fromUrl(fileUrl);
        yield room.say(fileBox);
        res.send('File sent');
    });
});
// Start server
app.listen(3000, () => {
    console.log("Express listening on port 3000");
    wechat_bot_js_1.bot.start()
        .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
        console.error('Bot start() fail:', e);
        yield wechat_bot_js_1.bot.stop();
        process.exit(-1);
    }));
});
//# sourceMappingURL=main.js.map