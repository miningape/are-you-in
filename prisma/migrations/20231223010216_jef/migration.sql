/*
  Warnings:

  - You are about to drop the column `picture_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "picture_id",
ADD COLUMN     "picture_url" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserAuthorization" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UserAuthorization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthorization_email_key" ON "UserAuthorization"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthorization_user_id_key" ON "UserAuthorization"("user_id");

-- AddForeignKey
ALTER TABLE "UserAuthorization" ADD CONSTRAINT "UserAuthorization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
