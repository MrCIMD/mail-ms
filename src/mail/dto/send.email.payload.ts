import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AttachmentDto } from './attachment.dto';
import { Type } from 'class-transformer';

export class SendEmailPayload {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  cc?: string[];

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  template: string;

  @IsEnum(['es', 'en'])
  @IsNotEmpty()
  lang: string;

  @IsObject()
  @IsOptional()
  context?: Record<string, any>;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
