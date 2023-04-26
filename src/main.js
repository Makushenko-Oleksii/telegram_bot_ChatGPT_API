import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from 'config'

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

//возвращает сообщение на любой введенный текс
bot.on(message('voice'), async (ctx) => {
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = (ctx.message.from.id)
    console.log(link.href)
    await ctx.reply(JSON.stringify(link, null, 2));
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