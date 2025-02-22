import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../roles/role.entity';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true }) // Allows null values for passwords
  passwordHash?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true }) 
  @JoinTable()
  roles: Role[];
    documents: any;
    
}
