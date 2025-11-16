import { MigrationInterface, QueryRunner } from "typeorm";

export class CourseDepartmentRelation1763296073541 implements MigrationInterface {
    name = 'CourseDepartmentRelation1763296073541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD "departmentId" uuid`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."enrollments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD "status" character varying NOT NULL DEFAULT 'enrolled'`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_2a26294560102d94bc4c67ecfe5" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_2a26294560102d94bc4c67ecfe5"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."enrollments_status_enum" AS ENUM('enrolled', 'completed', 'dropped')`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD "status" "public"."enrollments_status_enum" NOT NULL DEFAULT 'enrolled'`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "departmentId"`);
    }

}
