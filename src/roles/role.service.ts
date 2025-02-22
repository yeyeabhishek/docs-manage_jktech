import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(name: string): Promise<Role> {
    // const role = new Role();
    // role.name = name;
    // console.log("=======role============",role)
    // console.log("==========name==========",name)
    // return this.roleRepository.save(role);

        // 🔍 Check if the role already exists
        const existingRole = await this.roleRepository.findOne({ where: { name } });
        if (existingRole) {
          throw new Error(`Role '${name}' already exists.`);
        }
    
        // ✅ If role doesn't exist, create and save it
        const role = this.roleRepository.create({ name });
        return await this.roleRepository.save(role);
      }
  


  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
