import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsString, MinLength } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column()
  @IsString()
  @MinLength(6)
  password!: string;

  @Column()
  @IsString()
  firstName!: string;

  @Column()
  @IsString()
  lastName!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Helper methods
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
} 