import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Finds a user by their email.
   * @param email - The email of the user.
   * @returns A user object or null if not found.
   */
  async findByEmail(email: string): Promise<User | null> {
    console.log('======= Fetching user by email =======');
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles'], // Fetch user roles along with user details.
    });
  }

  /**
   * Retrieves all users from the database.
   * @returns A list of all users.
   */
  async findAllUsers(): Promise<User[]> {
    console.log('======= Fetching all users =======');
    return this.userRepository.find();
  }

  /**
   * Creates a new user with an encrypted password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @param role - The role assigned to the user.
   * @returns The newly created user.
   */
  async createUser(email: string, password: string, role: UserRole): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving.

    const user = new User();
    user.email = email;
    user.passwordHash = hashedPassword;
    user.roles = []; // Assign an empty roles array initially.

    return this.userRepository.save(user);
  }

  /**
   * Updates a user's role.
   * @param userId - The ID of the user.
   * @param roleName - The name of the new role.
   * @returns The updated user object.
   */
  async updateUserRole(userId: string, roleName: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'], // Fetch roles for proper role assignment.
    });

    console.log('========= User Found =========', user);

    if (!user) throw new Error('User not found');

    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) throw new Error('Role not found');

    user.roles = [role]; // Assign the new role to the user.

    return this.userRepository.save(user);
  }
}
