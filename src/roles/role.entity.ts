import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../users/user.entity';

/**
 * Entity representing a role in the system.
 */
@Entity()
export class Role {
  /**
   * Unique identifier for the role.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Name of the role.
   * This field must be unique.
   */
  @Column({ unique: true })
  name: string;

  /**
   * Many-to-Many relationship with the User entity.
   * A role can be assigned to multiple users.
   */
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
