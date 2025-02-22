import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { Role } from '../roles/role.entity'; // ✅ Import Role entity

//===========================


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>, 
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>, // ✅ Inject Role Repository
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, role: UserRole) {
    console.log("Checking role:", role); // Debugging line

    const hashedPassword = await bcrypt.hash(password, 10);

    // Fetch the role entity
    const roleEntity = await this.roleRepository.findOne({ where: { name: role } });

    console.log("Found role entity:", roleEntity); // Debugging line

    if (!roleEntity) {
        throw new Error('Role not found'); 
    }

    const user = this.userRepository.create({ 
        email, 
        passwordHash: hashedPassword,
        roles: [roleEntity] // Ensure correct format
    });

    return this.userRepository.save(user);
}



  async login(email: string, password: string) {
    console.log("===========login=============")
    const user = await this.userRepository.findOne({ where: { email } });
    console.log("===========user=============",user)

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id, role: user.roles });
    return { access_token: token };
  }
}
