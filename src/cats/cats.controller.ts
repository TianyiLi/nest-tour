import { Controller, Get, Sse } from '@nestjs/common';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

import { EventEmitter } from 'events';

const e = new EventEmitter();
interface messageQStruct {
  id: number;
  type: 'message' | 'pending';
  content?: string;
  clientId: string;
}

@Controller('cats')
export class CatsController {
  private messageQ: messageQStruct[] = [];
  private e = new EventEmitter();

  @Get('')
  async findAll() {
    e.emit('message', 'test');
    return 'This action return all cats';
  }

  @Get('note')
  note(): string {
    return 'note';
  }

  @Get('getSSe')
  getHello() {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    
    <body>
      <script>
        const e = new EventSource('/cats/sse')
        e.onmessage = ({data}) => console.log(data)
      </script>
    </body>
    
    </html>`;
  }

  @Sse('sse')
  sse(): Observable<{ data: any }> {
    return fromEvent<string>(e, 'message').pipe(
      map(data => (console.log(data), { data: { message: data } })),
    );
  }
}
