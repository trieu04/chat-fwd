import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
  ChatModule,
  ConfigModule.forRoot({
    isGlobal: true,
  }),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
