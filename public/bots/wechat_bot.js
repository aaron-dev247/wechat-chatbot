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
exports.bot = void 0;
const wechaty_1 = require("wechaty");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const file_box_1 = require("file-box");
/**
 *
 * 1. Declare your Bot!
 *
 */
const options = {
    name: 'wechat-bot',
    /**
     * You can specify different puppet for different IM protocols.
     * Learn more from https://wechaty.js.org/docs/puppet-providers/
     */
    // puppet: 'wechaty-puppet-whatsapp'
    /**
     * You can use wechaty puppet provider 'wechaty-puppet-service'
     *   which can connect to Wechaty Puppet Services
     *   for using more powerful protocol.
     * Learn more about services (and TOKEN)from https://wechaty.js.org/docs/puppet-services/
     */
    // puppet: 'wechaty-puppet-service'
    // puppetOptions: {
    //   token: 'xxx',
    // }
};
exports.bot = wechaty_1.WechatyBuilder.build(options);
/**
 *
 * Register event handlers for Bot
 *
 */
exports.bot
    .on('logout', onLogout)
    .on('login', onLogin)
    .on('scan', onScan)
    .on('error', onError)
    .on('message', onMessage);
/**
 *
 * Define Event Handler Functions for:
 *  `scan`, `login`, `logout`, `error`, and `message`
 *
 */
function onScan(qrcode, status) {
    if (status === wechaty_1.ScanStatus.Waiting || status === wechaty_1.ScanStatus.Timeout) {
        qrcode_terminal_1.default.generate(qrcode, { small: true });
        const qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(qrcode),
        ].join('');
        console.info('onScan: %s(%s) - %s', wechaty_1.ScanStatus[status], status, qrcodeImageUrl);
    }
    else {
        console.info('onScan: %s(%s)', wechaty_1.ScanStatus[status], status);
    }
    // console.info(`[${ScanStatus[status]}(${status})] ${qrcodeImageUrl}\nScan QR Code above to log in: `)
}
function onLogin(user) {
    console.info(`${user.name()} login`);
}
function onLogout(user) {
    console.info(`${user.name()} logged out`);
}
function onError(e) {
    console.error('Bot error:', e);
    /*
    if (bot.isLoggedIn) {
      bot.say('Wechaty error: ' + e.message).catch(console.error)
    }
    */
}
function onMessage(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        console.info(msg.toString());
        if (msg.self()) {
            console.info('Message discarded because its outgoing');
            return;
        }
        if (msg.age() > 2 * 60) {
            console.info('Message discarded because its TOO OLD(than 2 minutes)');
            return;
        }
        if (msg.type() !== exports.bot.Message.Type.Text
            || !/^(ding|ping|bing|code)$/i.test(msg.text())) {
            console.info('Message discarded because it does not match ding/ping/bing/code');
            return;
        }
        /**
         * 1. reply 'dong'
         */
        yield msg.say('dong');
        console.info('REPLY: dong');
        /**
         * 2. reply image(qrcode image)
         */
        const fileBox = file_box_1.FileBox.fromUrl('https://wechaty.github.io/wechaty/images/bot-qr-code.png');
        yield msg.say(fileBox);
        console.info('REPLY: %s', fileBox.toString());
        /**
         * 3. reply 'scan now!'
         */
        yield msg.say([
            'Join Wechaty Developers Community\n\n',
            'Scan now, because other Wechaty developers want to talk with you too!\n\n',
            '(secret code: wechaty)',
        ].join(''));
    });
}
//# sourceMappingURL=wechat_bot.js.map