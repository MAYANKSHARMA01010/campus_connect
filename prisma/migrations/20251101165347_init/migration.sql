-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Gender" TEXT NOT NULL DEFAULT 'Prefer not to say',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Username_key" ON "User"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");
