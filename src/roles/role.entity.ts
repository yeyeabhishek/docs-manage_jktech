// import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
// import { User } from './user.entity';

// @Entity()
// export class Role {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ unique: true })
//   roleName: string;

//   @ManyToMany(() => User, (user) => user.roles)
//   users: User[];
// }



import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // ✅ Role name

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}

