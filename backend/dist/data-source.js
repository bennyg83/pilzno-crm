"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Family_1 = require("./entities/Family");
const FamilyMember_1 = require("./entities/FamilyMember");
const FamilyTier_1 = require("./entities/FamilyTier");
const Event_1 = require("./entities/Event");
const Donation_1 = require("./entities/Donation");
const Note_1 = require("./entities/Note");
const Email_1 = require("./entities/Email");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'pilzno-synagogue-db',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'synagogue_admin',
    password: process.env.DB_PASSWORD || 'synagogue_secure_pass',
    database: process.env.DB_NAME || 'pilzno_synagogue',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [
        User_1.User,
        Family_1.Family,
        FamilyMember_1.FamilyMember,
        FamilyTier_1.FamilyTier,
        Event_1.Event,
        Donation_1.Donation,
        Note_1.Note,
        Email_1.Email
    ],
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
});
//# sourceMappingURL=data-source.js.map