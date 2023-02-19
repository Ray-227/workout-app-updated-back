/*
  Warnings:

  - You are about to drop the column `exercise_log_id` on the `Exercises` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exercises" DROP CONSTRAINT "Exercises_exercise_log_id_fkey";

-- AlterTable
ALTER TABLE "Exercises" DROP COLUMN "exercise_log_id";

-- AlterTable
ALTER TABLE "Exercises_log" ADD COLUMN     "exercise_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Exercises_log" ADD CONSTRAINT "Exercises_log_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
