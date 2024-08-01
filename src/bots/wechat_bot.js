
import { WechatyBuilder } from 'wechaty';
import qrcodeTerminal from 'qrcode-terminal';


export const wechaty = WechatyBuilder.build() // 获取 Wechaty 对象

wechaty
    .on('scan', qrcode => qrcodeTerminal.generate(qrcode, { small: true }))  // 在 console 显示二维码
    .on('login', user => console.log(`User ${user} logged in`))
