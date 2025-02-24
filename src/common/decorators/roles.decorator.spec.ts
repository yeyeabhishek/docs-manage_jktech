import { SetMetadata } from '@nestjs/common';
import { Roles } from './roles.decorator';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('Roles Decorator', () => {
  it('should call SetMetadata with correct parameters', () => {
    Roles('admin', 'user');

    expect(SetMetadata).toHaveBeenCalledWith('roles', ['admin', 'user']);
  });

  it('should handle an empty roles array', () => {
    Roles();

    expect(SetMetadata).toHaveBeenCalledWith('roles', []);
  });
});
