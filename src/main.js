import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from 'config';
import { ogg } from './ogg.js';
import { openai } from './openai.js'
import { code } from "telegraf/format";

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

//возвращает сообщение на любой введенный текс
bot.on(message('voice'), async (ctx) => {
  try {
    await ctx.reply(code('Сообщение принял, жду ответ от сервера...'))
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = (ctx.message.from.id)
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);

    const text = await openai.transcription(mp3Path);
    // const response = await openai.chat(text)
    await ctx.reply(code(`Ваш запрос ${text}`))

    await ctx.reply(text);
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