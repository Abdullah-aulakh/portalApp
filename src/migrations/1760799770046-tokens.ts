import { MigrationInterface, QueryRunner } from "typeorm";

export class Tokens1760799770046 implements MigrationInterface {
    name = 'Tokens1760799770046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "userId" uuid, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
    }

}
