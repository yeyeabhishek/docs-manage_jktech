import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

/**
 * Service responsible for handling role-related operations.
 */
@Injectable()
export class RoleService {
  constructor(
    /**
     * Injecting the Role repository for database operations.
     */
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Creates a new role if it does not already exist.
   * @param name - The name of the role to be created.
   * @returns The created role.
   * @throws Error if the role already exists.
   */
  async createRole(name: string): Promise<Role> {
    // 🔍 Check if the role already exists
    const existingRole = await this.roleRepository.findOne({ where: { name } });
    if (existingRole) {
      throw new Error(`Role '${name}' already exists.`);
    }

    // ✅ If role doesn't exist, create and save it
    const role = this.roleRepository.create({ name });
    return await this.roleRepository.save(role);
  }

  /**
   * Retrieves all roles from the database.
   * @returns An array of all roles.
   */
  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
