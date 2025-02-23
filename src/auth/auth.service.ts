import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { Role } from '../roles/role.entity'; 
import {UserService} from '../users/user.service'


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>, 
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>, 
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(email: string, password: string, role: UserRole) {
    console.log("Checking role:", role); 
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleEntity = await this.roleRepository.findOne({ where: { name: role } });

    console.log("Found role entity:", roleEntity);

    if (!roleEntity) {
        throw new Error('Role not found'); 
    }

    const user = this.userRepository.create({ 
        email, 
        passwordHash: hashedPassword,
        roles: [roleEntity] 
    });

    return this.userRepository.save(user);
}


async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles.map(role => role.name),
    };
    console.log(payload)
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
