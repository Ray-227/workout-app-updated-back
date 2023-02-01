-- AlterTable
ALTER TABLE "Exercises" ADD COLUMN     "exercise_log_id" INTEGER;

-- CreateTable
CREATE TABLE "Exercises_log" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER,
    "workout_log_id" INTEGER,

    CONSTRAINT "Exercises_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercises_time" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "weight" INTEGER NOT NULL,
    "repeat" INTEGER NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "exercise_log_id" INTEGER,

    CONSTRAINT "Exercises_time_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workouts_log" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "workout_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "Workouts_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exercises" ADD CONSTRAINT "Exercises_exercise_log_id_fkey" FOREIGN KEY ("exercise_log_id") REFERENCES "Exercises_log"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercises_log" ADD CONSTRAINT "Exercises_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercises_log" ADD CONSTRAINT "Exercises_log_workout_log_id_fkey" FOREIGN KEY ("workout_log_id") REFERENCES "Workouts_log"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercises_time" ADD CONSTRAINT "Exercises_time_exercise_log_id_fkey" FOREIGN KEY ("exercise_log_id") REFERENCES "Exercises_log"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workouts_log" ADD CONSTRAINT "Workouts_log_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Workouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workouts_log" ADD CONSTRAINT "Workouts_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
