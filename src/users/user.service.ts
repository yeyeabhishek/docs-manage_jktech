import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './user.entity'; 
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/role.entity';



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    console.log("=======get users==============")
    return this.userRepository.findOne({ 
        where: { email },
        relations: ['roles'] 
    });
  }


  async findAllUsers(): Promise<User[]> {
    console.log("======= Fetching all users =======");
    return this.userRepository.find();
  }
  
  async createUser(email: string, password: string, role: UserRole): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); 
    const user = new User();
    user.email = email;
    user.passwordHash = hashedPassword; 
    user.roles = []; 
  
    return this.userRepository.save(user);
  }

async updateUserRole(userId: string , roleName: string) {
    const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['roles'],
    });
     console.log("=========user=============",user)
    if (!user) throw new Error('User not found');

    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) throw new Error('Role not found');

    user.roles = [role];

    return this.userRepository.save(user); 
}

  
  
}
