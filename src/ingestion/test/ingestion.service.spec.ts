import { ConfigService } from '../ingestion.service';
import { of } from 'rxjs';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService({
      database: { host: 'localhost', port: 5432 },
      apiKey: 'dummy-api-key',
    });
  });

  it('should return the value from internalConfig when key exists', () => {
    expect(configService.get('database.host')).toBe('localhost');
    expect(configService.get('apiKey')).toBe('dummy-api-key');
  });

  it('should return the value from process.env when key exists', () => {
    process.env.TEST_ENV_VAR = 'test-value';
    expect(configService.get('TEST_ENV_VAR')).toBe('test-value');
  });

  it('should return default value when key does not exist', () => {
    expect(configService.get('nonexistentKey', 'defaultValue')).toBe('defaultValue');
  });

  it('should throw an error when using getOrThrow for a missing key', () => {
    expect(() => configService.getOrThrow('nonexistentKey')).toThrow();
  });

  it('should set a configuration value and retrieve it', () => {
    configService.set('newKey', 'newValue');
    expect(configService.get('newKey')).toBe('newValue');
  });

  it('should return an observable for configuration changes', (done) => {
    const mockChange$ = of({ path: 'database.host', oldValue: 'localhost', newValue: '127.0.0.1' });
    jest.spyOn(configService, 'changes$', 'get').mockReturnValue(mockChange$);

    configService.changes$.subscribe((change) => {
      expect(change.path).toBe('database.host');
      expect(change.oldValue).toBe('localhost');
      expect(change.newValue).toBe('127.0.0.1');
      done();
    });
  });

  it('should set environment file paths and retrieve them', () => {
    configService.setEnvFilePaths(['.env.test', '.env.local']);
    expect(configService['envFilePaths']).toEqual(['.env.test', '.env.local']);
  });
});
