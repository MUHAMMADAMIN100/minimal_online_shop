import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  async sendMessage(text: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      this.logger.warn('Telegram env not set — skip notification');
      return;
    }
    try {
      await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        { chat_id: chatId, text, parse_mode: 'HTML' },
        { timeout: 10000 },
      );
    } catch (e: any) {
      this.logger.error('Telegram send failed', e?.response?.data || e.message);
    }
  }
}
