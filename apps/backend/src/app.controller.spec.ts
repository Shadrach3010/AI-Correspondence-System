import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return ICMS system metadata', () => {
      const result = appController.getAppInfo();

      expect(result).toMatchObject({
        name: 'ICMS',
        status: 'ready',
        module: 'core',
      });
    });
  });
});
