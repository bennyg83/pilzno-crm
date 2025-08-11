import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Family } from './entities/Family';
import { FamilyMember } from './entities/FamilyMember';
import { FamilyTier } from './entities/FamilyTier';
import { Event } from './entities/Event';
import { Donation } from './entities/Donation';
import { Note } from './entities/Note';
import { Email } from './entities/Email';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'pilzno-synagogue-db',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'synagogue_admin',
  password: process.env.DB_PASSWORD || 'synagogue_secure_pass',
  database: process.env.DB_NAME || 'pilzno_synagogue',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    Family,
    FamilyMember,
    FamilyTier,
    Event,
    Donation,
    Note,
    Email
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
}); 