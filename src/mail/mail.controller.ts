import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SendEmailPayload } from './dto';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('send.one.email')
  async sendEmail(@Payload() payload: SendEmailPayload) {
    await this.mailService.awsMailSend(payload);
  }
}
