import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppInfo() {
    return {
      name: 'ICMS',
      status: 'ready',
      module: 'core',
      version: '1.0.0',
      description: 'Intelligent Correspondence Management System',
    };
  }
}
