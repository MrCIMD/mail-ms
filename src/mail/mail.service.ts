import { SendEmailCommand, SendEmailCommandInput } from '@aws-sdk/client-sesv2';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { SendEmailPayload } from './dto';
import { SESv2Service } from './sesv2.service';
import { TemplateService } from './template.service';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);

  constructor(
    private readonly _ses: SESv2Service,
    private readonly _template: TemplateService,
  ) {}

  /**
   * Envía un correo electrónico usando AWS SES
   *
   * @async
   * @param {SendEmailPayload} payload - Configuración del correo
   * @returns {*}
   */
  async awsMailSend(payload: SendEmailPayload) {
    try {
      const raw = await this._template.buildRaw(payload);

      const params: SendEmailCommandInput = {
        Content: {
          Raw: { Data: raw },
        },
      };

      const command = new SendEmailCommand(params);

      await this._ses.client.send(command);
    } catch (error) {
      this._logger.error('Could not send email');
      console.error(JSON.stringify(error, null, 2));
      throw new RpcException({
        message: 'Could not send email',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  }
}
