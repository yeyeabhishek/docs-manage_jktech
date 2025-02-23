import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../roles/role.entity';

/**
 * Enum representing different user roles.
 */
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  USER = 'USER',
}

/**
 * Entity representing a User in the system.
 */
@Entity()
export class User {
  /**
   * Unique identifier for the user.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Email of the user (must be unique).
   */
  @Column({ unique: true })
  email: string;

  /**
   * Hashed password of the user (optional).
   */
  @Column({ nullable: true })
  passwordHash?: string;

  /**
   * Timestamp when the user was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Many-to-Many relationship with the Role entity.
   * A user can have multiple roles.
   */
  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles_role', // Name of the join table
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  /**
   * Documents associated with the user (any type).
   * This property may require further definition or relation setup.
   */
  documents: any;
}
