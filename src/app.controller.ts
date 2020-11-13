import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  MiddlewareConsumer,
  NestModule,
  Param,
  Post,
  Query,
  RequestMethod,
} from '@nestjs/common';
import Axios from 'axios';
import { AppService } from './app.service';
import { AuthMiddleware } from './auth.middleware';
const FormData = require('form-data');
const sampleToken = '123456789abcdef';

@Controller()
export class AppController implements NestModule {
  constructor(private readonly appService: AppService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'data', method: RequestMethod.GET });
  }

  @Get()
  getHello(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    
    <body>
      <script>
        const link = '${
          process.env.OAUTH2_SERVICE_URL
        }/oauth/authorize?client_id=${
      process.env.CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      process.env.REDIRECT_URI,
    )}&scope=&response_type=code&state=${process.env.STATE}';
        window.iiiframe;
        function onClick() {
          document.querySelector('#state').textContent = 'pending'
          window.iiiframe = window.open(link,'testName','width=950,height=650,scrollbars=yes,resizable=yes');
          console.log('window open')
          window.addEventListener('message', arg => {
            console.log(arg)
            if (arg.data.act === 'token') {
            document.querySelector('#state').textContent = 'success'
            window.iiiframe.postMessage({act: 'ok'}, '*')
            }
          })
        }
      </script>
      <button type="button" onclick="onClick()">Click</button>
      <div id="state">init</div>
    </body>
    
    </html>`;
  }
  // http://54.177.42.67/oauth/authorize?client_id=91fac526-9987-469e-88b7-687f58eefe5a&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Ftest&scope=&response_type=code&state=xWjy0hZUSs3gAY5YNHoKRFFyrsm5B5WKxQWqfhSz
  @Get('/test')
  async getSSOTemplate(
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    try {
      console.log(code, state);
      const form = new FormData();
      const payload = {
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code,
      };
      Object.entries(payload).forEach(([key, value]) =>
        form.append(key, value),
      );
      const result = await Axios.post(`${process.env.OAUTH2_SERVICE_URL}/oauth/token`, form, {
        headers: form.getHeaders(),
      });
      console.log(result);
      return /*html*/ `

      <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    
    <body>
    <script>
    const token = '${sampleToken}'
    window.opener.postMessage({act:'token', token}, '*')
    window.onmessage = arg => {
      console.log(arg)
      if (arg.data.act === 'ok')
        window.close()
    }
  </script>
    </body>
    
    </html>
        
      `;
    } catch (error) {
      console.log('request error');
      console.error(error);
      return error.message;
    }
  }

  @Post('/token')
  async onToken(@Body() body: { token: string }) {
    if (body.token !== sampleToken)
      throw new HttpException(
        'Invalid token',
        HttpStatus.NON_AUTHORITATIVE_INFORMATION,
      );
    return { data: [], message: 'success' };
  }

  @Get('/data')
  responseData() {
    return {
      data: 'ok',
      message: 'success',
    };
  }
}
