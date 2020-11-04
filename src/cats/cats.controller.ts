import { Controller, Get, Param, Req } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get('')
  findAll(): string {
    return 'This action return all cats';
  }

  @Get('note')
  note(): string {
    return 'note'
  }
}
