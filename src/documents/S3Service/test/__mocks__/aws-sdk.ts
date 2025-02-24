jest.mock('aws-sdk', () => {
    return {
      S3: jest.fn().mockImplementation(() => ({
        upload: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({ Location: 'https://s3-bucket-url/file.pdf' }),
        }),
        deleteObject: jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue({}), // Simulating successful deletion
        }),
      })),
    };
  });
  