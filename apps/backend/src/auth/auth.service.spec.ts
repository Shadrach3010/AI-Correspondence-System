import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should hash and validate a password', async () => {
    const password = 'StrongPass!123';
    const hash = await service.hashPassword(password);

    await expect(service.validatePassword(password, hash)).resolves.toBe(true);
  });

  it('should issue a valid JWT for a payload', async () => {
    const token = await service.signToken({ sub: 'user-123', role: 'registry_officer' });
    const payload = await service.verifyToken(token);

    expect(payload).toMatchObject({
      sub: 'user-123',
      role: 'registry_officer',
    });
  });

  it('should reject an invalid token', async () => {
    await expect(service.verifyToken('invalid-token')).rejects.toThrow(UnauthorizedException);
  });
});
