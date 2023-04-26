import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from 'config';
import {ogg} from './ogg.js'

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

//возвращает сообщение на любой введенный текс
bot.on(message('voice'), async (ctx) => {
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = (ctx.message.from.id)
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId)
    await ctx.reply(mp3Path);
  } catch (error) {
    console.log(`Error while voice message`, error.message);
  }
})

// /start - возвращает сообщение по такой команде
bot.command('start', async (ctx) => {
  await ctx.reply(JSON.stringify(ctx.message, null, 2));
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))