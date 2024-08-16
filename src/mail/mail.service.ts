import {
  SendEmailCommand,
  SendEmailCommandInput,
  SESv2,
} from '@aws-sdk/client-sesv2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESv2Config } from './sesv2.config';

@Injectable()
export class MailService {
  private readonly _sesv2Client: SESv2;
  private readonly _identityName: string;

  constructor(private readonly _config: ConfigService) {
    const sesv2Config = new SESv2Config(_config);

    this._sesv2Client = sesv2Config.getClient();
    this._identityName = sesv2Config.getIdentityName();
  }

  async sendEmail(to: string, subject: string, body: string) {
    const params: SendEmailCommandInput = {
      Destination: { ToAddresses: [to] },
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: { Text: { Data: body } },
        },
      },
      FromEmailAddress: this._identityName,
    };

    const command = new SendEmailCommand(params);

    const result = await this._sesv2Client.send(command);

    console.log(result);
  }
}
