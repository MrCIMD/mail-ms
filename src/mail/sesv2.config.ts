import { SESv2 } from '@aws-sdk/client-sesv2';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from './../common/config';

export class SESv2Config {
  private readonly _sesv2Client: SESv2;
  private readonly _identityName: string;

  constructor(private readonly _config: ConfigService) {
    const region = this._config.get<string>(ConfigEnum.AWS_REGION);
    const accessKeyId = this._config.get<string>(ConfigEnum.IAM_ACCESS_KEY);
    const secretAccessKey = this._config.get<string>(ConfigEnum.IAM_SECRET_KEY);

    this._sesv2Client = new SESv2({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
    });

    this._identityName = this._config.get<string>(ConfigEnum.IDENTITY_NAME);
  }

  getClient(): SESv2 {
    return this._sesv2Client;
  }

  getIdentityName(): string {
    return this._identityName;
  }
}
