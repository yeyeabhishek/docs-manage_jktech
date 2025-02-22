import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @ManyToOne(() => User, (user) => user.documents, { nullable: true }) // ✅ Corrected relation
  uploadedBy: User;

  @CreateDateColumn()
  uploadedAt: Date;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 'not_started' })
  ingestionStatus: string;
}


