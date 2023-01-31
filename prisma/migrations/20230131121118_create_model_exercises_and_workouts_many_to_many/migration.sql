-- CreateTable
CREATE TABLE "Exercises" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "times" INTEGER NOT NULL,
    "icon_path" TEXT NOT NULL,

    CONSTRAINT "Exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workouts" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExercisesToWorkouts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExercisesToWorkouts_AB_unique" ON "_ExercisesToWorkouts"("A", "B");

-- CreateIndex
CREATE INDEX "_ExercisesToWorkouts_B_index" ON "_ExercisesToWorkouts"("B");

-- AddForeignKey
ALTER TABLE "_ExercisesToWorkouts" ADD CONSTRAINT "_ExercisesToWorkouts_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExercisesToWorkouts" ADD CONSTRAINT "_ExercisesToWorkouts_B_fkey" FOREIGN KEY ("B") REFERENCES "Workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
