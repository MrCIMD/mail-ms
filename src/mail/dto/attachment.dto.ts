import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AttachmentDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsNotEmpty()
  @Transform(({ value }) => Buffer.from(value))
  content?: Buffer;
}
