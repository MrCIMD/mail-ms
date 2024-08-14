import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('send-email')
  async sendEmail(@Payload() payload: any) {
    console.log('send-email', payload);
  }
}
