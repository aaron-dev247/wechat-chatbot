import express from 'express';
import { wechaty } from './bots/wechat_bot.js';
import { FileBox } from 'file-box';

const app = express();

app.get('/', async function (req, res) {
    // 根据群名字获取 room
    const room = await wechaty.Room.find("test_group");
    const fileBox = FileBox.fromUrl('https://wechaty.github.io/wechaty/images/bot-qr-code.png');
    // 群内发文件
    await room.say(fileBox);
})

app.listen(3000, () => {
    wechaty.start();
    console.log("Express listening on port 3000");
});
