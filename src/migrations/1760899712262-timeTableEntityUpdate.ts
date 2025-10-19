import { MigrationInterface, QueryRunner } from "typeorm";

export class TimeTableEntityUpdate1760899712262 implements MigrationInterface {
    name = 'TimeTableEntityUpdate1760899712262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timetables" DROP CONSTRAINT "FK_e7a92987b7b7b005c964c54eab8"`);
        await queryRunner.query(`ALTER TABLE "timetables" DROP COLUMN "teacherId"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "grade"`);
        await queryRunner.query(`DROP TYPE "public"."grades_grade_enum"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "grade" character varying`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."grades_type_enum"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."grades_type_enum" AS ENUM('assignment', 'project', 'quiz', 'presentation', 'midterm', 'finalterm')`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "type" "public"."grades_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "grade"`);
        await queryRunner.query(`CREATE TYPE "public"."grades_grade_enum" AS ENUM('A', 'B', 'C', 'D', 'F', 'W')`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "grade" "public"."grades_grade_enum"`);
        await queryRunner.query(`ALTER TABLE "timetables" ADD "teacherId" uuid`);
        await queryRunner.query(`ALTER TABLE "timetables" ADD CONSTRAINT "FK_e7a92987b7b7b005c964c54eab8" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
