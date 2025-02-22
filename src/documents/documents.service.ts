import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class DocumentsService {
  private s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  async uploadFile(file: Express.Multer.File) {
    console.log("===========Abhishek Upload======");

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `documents/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };

    console.log("=======Uploading to bucket==========", params);

    return this.s3.upload(params).promise();
  }

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





//=============================================

