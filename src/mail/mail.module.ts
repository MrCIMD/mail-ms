import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';
import { SESv2Service } from './sesv2.service';
import { TemplateService } from './template.service';

@Module({
  imports: [ConfigModule],
  controllers: [MailController],
  providers: [SESv2Service, MailService, TemplateService],
})
export class MailModule {}
