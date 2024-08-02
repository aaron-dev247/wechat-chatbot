import { bot } from '../bots/wechat_bot';
import { FileBox } from 'file-box';

/** 通过群名称获取群 ID */
export async function getRoomInfo(name?: string) {
  if (!name) throw new Error('Room name is required');

  let room = await bot.Room.find({ topic: name });

  if (!room) throw new Error('Room not found');

  return { id: room.id };
}

/** 通过群 ID 发送文本消息 */
export async function sendTextMessageToRoom(id?: string, text?: string) {
  if (!id) throw new Error('Room ID is required');
  if (!text) throw new Error('Message text is required');

  const room = await bot.Room.find({ id });

  if (!room)
    throw new Error('Room not found');

  await room.say(text);
}

/** 通过群 ID 发送文件 */
export async function sendFileToRoom(id?: string, file?: FileBox) {
  if (!id) throw new Error('Room ID is required');
  if (!file) throw new Error('File is required');

  const room = await bot.Room.find({ id });

  if (!room)
    throw new Error('Room not found');

  await room.say(file);
}
