import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    getHelloAdmin(): string {
        return 'Hello Admin!';
    }

    getHelloUser(): string {
        return 'Hello User!';
    }
}
