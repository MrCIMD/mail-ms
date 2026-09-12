import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import {
  createTransport,
  SendMailOptions,
  SentMessageInfo,
  Transporter,
} from 'nodemailer';
import { resolve } from 'path';
import { SendEmailPayload } from './dto';
import { ConfigEnum } from '../common/config';

@Injectable()
export class TemplateService {
  private readonly _logger = new Logger(TemplateService.name);
  private readonly _transport: Transporter<SentMessageInfo>;
  private readonly _identityName: string;
  private readonly _folderName: string;

  constructor(private readonly _config: ConfigService) {
    this._transport = createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });

    this._identityName = this._config.get<string>(ConfigEnum.IDENTITY_NAME);
    this._folderName = this._config.get<string>(ConfigEnum.TEMPLATE_DIR);
  }

  /**
   * Construye un template de correo en formato HTML
   *
   * @public
   * @param {string} path - Ruta del template
   * @param {string} lang - Lenguaje del template
   * @param {any} context - Contexto de datos
   * @returns {string} - Template de correo
   */
  public buildHtml(path: string, lang: string, context?: any): string {
    try {
      const route = path.split('/');

      const lastIndex = route.length - 1;
      const templateName = `${route[lastIndex]}-${lang}.hbs`;
      route.splice(lastIndex, 1);
      // Construye la ruta del template

      if (this._folderName) {
        const location = resolve(this._folderName, ...route, templateName);

        const source = readFileSync(location, 'utf8');
        const template = compile(source);
        const html = template(context);

        return html;
      }
    } catch (error) {
      this._logger.error('Error building html template', error);
      throw new Error('Error building html template');
    }
  }

  /**
   * Construye un Uint8Array deacuerdo a las opciones del correo
   *
   * @public
   * @param {SendEmailPayload} payload - Opciones del correo
   * @returns {Promise<Uint8Array>}
   */
  public buildRaw(payload: SendEmailPayload): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
      const { template, lang, context } = payload;

      const html = this.buildHtml(template, lang, context);

      const { to, cc, subject } = payload;

      const options: SendMailOptions = {
        from: this._identityName,
        to,
        cc,
        subject,
        html,
        attachments: payload?.attachments,
      };

      this._transport.sendMail(options, (error, info) => {
        if (error) {
          this._logger.error('Error building raw template', error);
          reject('Error building raw template');
        } else {
          const mimeMessage = info.message.toString();
          const mimeMessageUint8Array = new TextEncoder().encode(mimeMessage);

          resolve(mimeMessageUint8Array);
        }
      });
    });
  }
}
