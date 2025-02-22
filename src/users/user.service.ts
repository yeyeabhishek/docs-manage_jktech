import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './user.entity'; // Import the UserRole enum
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService {
  roleRepository: any;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    console.log("=======get users==============")
    return this.userRepository.findOne({ where: { email } });
  }


  async findAllUsers(): Promise<User[]> {
    console.log("======= Fetching all users =======");
    return this.userRepository.find();
  }
  
  async createUser(email: string, password: string, role: UserRole): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const user = new User();
    user.email = email;
    user.passwordHash = hashedPassword; // Use passwordHash
    user.roles = []; // Assuming roles is an array
  
    return this.userRepository.save(user);
  }

  async assignRoleToUser(roleName: string): Promise<User> {
    console.log("======assignRoleToUser===================")
    // const user = await this.userRepository.findOne({
    //   where: {name:name },
    //   relations: ['roles'],
    // });
  
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }
  
    let role = await this.roleRepository.findOne({ where: { name: roleName } });
  
    if (!role) {
      role = await this.roleRepository.save({ name: roleName });
    }
  
    // if (!user.roles.some((r) => r.id === role.id)) {
    //   user.roles.push(role);
    //   await this.userRepository.save(user);
    // }
  
    return role;
  }
  
  
}
