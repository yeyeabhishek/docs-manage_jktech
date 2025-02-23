import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

/**
 * Representing a document entity in the database.
 */
@Entity()
export class Document {
  /**
   * Unique identifier for the document, generated as a UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Naming of the file.
   */
  @Column()
  fileName: string;

  /**
   * URL where the file is stored.
   */
  @Column()
  fileUrl: string;

  /**
   * The user who uploaded the document.
   * This relationship is optional (nullable).
   */
  @ManyToOne(() => User, (user) => user.documents, { nullable: true }) 
  uploadedBy: User;

  /**
   * Timestamp indicating when the document was uploaded.
   * Automatically set upon creation.
   */
  @CreateDateColumn()
  uploadedAt: Date;

  /**
   * Status of the document.
   * Default value is 'pending'.
   */
  @Column({ default: 'pending' })
  status: string;

  /**
   * Ingestion status of the document.
   * Default value is 'not_started'.
   */
  @Column({ default: 'not_started' })
  ingestionStatus: string;
}
