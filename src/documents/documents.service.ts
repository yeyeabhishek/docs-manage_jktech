import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

/**
 * Service responsible for handling file operations with AWS S3.
 */
@Injectable()
export class DocumentsService {
  /**
   * AWS S3 instance configured with credentials and region from environment variables.
   */
  private s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  /**
   * Uploads a file to the specified S3 bucket.
   * @param file - The file object received from the client.
   * @returns A promise resolving with the uploaded file details.
   */
  async uploadFile(file: Express.Multer.File) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `documents/${Date.now()}-${file.originalname}`, // Generates a unique file name
      Body: file.buffer,
    };

    console.log('======= Uploading to S3 bucket ==========', params);

    return this.s3.upload(params).promise();
  }

  /**
   * Deletes a file from the S3 bucket.
   * @param fileKey - The key (path) of the file to be deleted in S3.
   * @returns A promise that resolves when the file is successfully deleted.
   */
  async deleteFileFromS3(fileKey: string): Promise<void> {
    try {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
      };

      console.log(`Deleting file from S3: ${fileKey}`);
      await this.s3.deleteObject(deleteParams).promise();
      console.log(`✅ File deleted successfully from S3: ${fileKey}`);
    } catch (error) {
      console.error('❌ Error deleting file from S3:', error);
      throw new Error('Failed to delete file from S3');
    }
  }
}
