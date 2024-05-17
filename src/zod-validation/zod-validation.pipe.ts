import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Schema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private validationSchema: Schema) {}
  transform(value: any) {
    try {
      const parsedValue = this.validationSchema.parse(value);
      return parsedValue;
    } catch (error) {
      const errorMessage = error.issues[0].message;
      throw new BadRequestException(errorMessage);
    }
  }
}
