import {
  WechatyBuilder,
  ScanStatus,
  Message,
  Contact,
} from "wechaty";

import qrTerm from "qrcode-terminal";

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
}

export const bot = WechatyBuilder.build(options)

/**
 *
 * Register event handlers for Bot
 *
 */
bot
  .on('logout', onLogout)
  .on('login', onLogin)
  .on('scan', onScan)
  .on('error', onError)
  .on('message', onMessage)

/**
 *
 * Define Event Handler Functions for:
 *  `scan`, `login`, `logout`, `error`, and `message`
 *
 */
function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    qrTerm.generate(qrcode, { small: true })

    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')

    console.info('onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
  } else {
    console.info('onScan: %s(%s)', ScanStatus[status], status)
  }

  // console.info(`[${ScanStatus[status]}(${status})] ${qrcodeImageUrl}\nScan QR Code above to log in: `)
}

function onLogin(user: Contact) {
  console.info(`${user.name()} login`)
}

function onLogout(user: Contact) {
  console.info(`${user.name()} logged out`)
}

function onError(e: Error) {
  console.error('Bot error:', e)
  /*
  if (bot.isLoggedIn) {
    bot.say('Wechaty error: ' + e.message).catch(console.error)
  }
  */
}

async function onMessage(msg: Message) {

  if (msg.self()) {
    // console.info('Message discarded because its outgoing')
    return
  }

  if (msg.age() > 2 * 60) {
    // console.info('Message discarded because its TOO OLD(than 2 minutes)')
    return
  }

  console.info(msg.toString())

  // if (msg.type() !== bot.Message.Type.Text
  //   || !/^(ding|ping|bing|code)$/i.test(msg.text())
  // ) {
  //   console.info('Message discarded because it does not match ding/ping/bing/code')
  //   return
  // }

}
