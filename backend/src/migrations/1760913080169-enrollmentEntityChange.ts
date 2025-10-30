import { MigrationInterface, QueryRunner } from "typeorm";

export class EnrollmentEntityChange1760913080169 implements MigrationInterface {
    name = 'EnrollmentEntityChange1760913080169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."enrollments_status_enum" AS ENUM('enrolled', 'completed', 'dropped')`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD "status" "public"."enrollments_status_enum" NOT NULL DEFAULT 'enrolled'`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "grade"`);
        await queryRunner.query(`CREATE TYPE "public"."grades_grade_enum" AS ENUM('A', 'B', 'C', 'D', 'F', 'W')`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "grade" "public"."grades_grade_enum"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."grades_type_enum" AS ENUM('assignment', 'project', 'quiz', 'presentation', 'midterm', 'finalterm')`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "type" "public"."grades_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."grades_type_enum"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "grade"`);
        await queryRunner.query(`DROP TYPE "public"."grades_grade_enum"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "grade" character varying`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."enrollments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD "status" character varying NOT NULL DEFAULT 'enrolled'`);
    }

}
