import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>, 

    @InjectRepository(Role) 
    private readonly roleRepository: Repository<Role>, 

    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Registering a new user with the provided email, password, and role.
   * 
   * @param email - The email address of the user.
   * @param password - The user's password (plaintext).
   * @param role - The role assigned to the user.
   * @returns The created user entity.
   * @throws Error if the specified role is not found.
   */
  async register(email: string, password: string, role: UserRole) {
    console.log('Checking role:', role);

    // Hashing the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Fetching the role entity from the database
    const roleEntity = await this.roleRepository.findOne({ where: { name: role } });

    console.log('Found role entity:', roleEntity);

    if (!roleEntity) {
      throw new Error('Role not found');
    }

    // Creating and save the new user
    const user = this.userRepository.create({ 
      email, 
      passwordHash: hashedPassword,
      roles: [roleEntity],
    });

    return this.userRepository.save(user);
  }

  /**
   * Validating a user's credentials by checking the email and password.
   * 
   * @param email - The user's email address.
   * @param password - The user's password (plaintext).
   * @returns The user entity if credentials are valid.
   * @throws UnauthorizedException if credentials are invalid.
   */
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  /**
   * Logs in a user by validating credentials and generating a JWT token.
   * 
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns An object containing the access token.
   */
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    // Create the JWT payload
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles.map(role => role.name),
    };

    console.log(payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
