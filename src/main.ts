import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { bot } from './bots/wechat_bot';
import { FileBox } from 'file-box';
import { getRoomInfo, sendFileToRoom, sendTextMessageToRoom } from './util/room_util';
import getRawBody from 'raw-body';

const app = express()
    .use(express.json()) // 解析 JSON 请求体
    .use(cors()) // 允许跨域

const upload = multer({
    storage: multer.memoryStorage()
});

// 通过群名称获取群信息
app.post('/room', async (req, res) => {
    try {
        res.json(await getRoomInfo(req.body.name))
    } catch (error: any) {
        res.status(404).send(error.message);
    }
});

// 通过群 ID 或群名称发送消息
app.post('/room/text', async (req, res) => {
    let { id, name, text } = req.body;

    if (!id && !name) {
        res.status(400).send('Room ID or name is required');
        return;
    }

    if (!id) {
        try {
            id = (await getRoomInfo(name)).id;
        } catch (error: any) {
            res.status(404).send(error.message);
            return;
        }
    }

    try {
        await sendTextMessageToRoom(id, text);
        res.send('Text message sent');
    } catch (error: any) {
        res.status(404).send(error.message);
        return;
    }
});

// 接收文件发送到指定 ID 的群
app.post('/room/file', upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        res.status(400).send('File is required');
        return;
    }

    try {
        await sendFileToRoom(req.body.id, FileBox.fromBuffer(file.buffer, file.originalname));
        res.send('File sent');
    } catch (error: any) {
        res.status(404).send(error.message);
    }
});

// 接收 bytes ( 字节流 ) 转为文件发送到指定 ID 的群
app.post('/room/file/bytes', async (req, res) => {
    const id = req.query.id;
    const originalname = req.query.filename as string;

    if (!id) {
        res.status(400).send('Room ID is required');
        return;
    }
    if (!originalname) {
        res.status(400).send('Filename is required');
        return;
    }

    try {
        const binaryData = await getRawBody(req);

        if (!binaryData) {
            res.status(400).send('File is required');
            return;
        }

        await sendFileToRoom(id as string, FileBox.fromBuffer(binaryData, originalname));
        res.send('File sent');
    } catch (error: any) {
        res.status(404).send(error.message);
    }
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
