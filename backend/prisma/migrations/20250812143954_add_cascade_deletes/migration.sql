-- DropForeignKey
ALTER TABLE "public"."MultipleChoiceOption" DROP CONSTRAINT "MultipleChoiceOption_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserAnswer" DROP CONSTRAINT "UserAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserAnswer" DROP CONSTRAINT "UserAnswer_submissionId_fkey";

-- CreateTable
CREATE TABLE "public"."KnowledgePoint" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "KnowledgePoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_KnowledgePointToQuestion" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_KnowledgePointToQuestion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgePoint_name_key" ON "public"."KnowledgePoint"("name");

-- CreateIndex
CREATE INDEX "_KnowledgePointToQuestion_B_index" ON "public"."_KnowledgePointToQuestion"("B");

-- AddForeignKey
ALTER TABLE "public"."KnowledgePoint" ADD CONSTRAINT "KnowledgePoint_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultipleChoiceOption" ADD CONSTRAINT "MultipleChoiceOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAnswer" ADD CONSTRAINT "UserAnswer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."ExamSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAnswer" ADD CONSTRAINT "UserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_KnowledgePointToQuestion" ADD CONSTRAINT "_KnowledgePointToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."KnowledgePoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_KnowledgePointToQuestion" ADD CONSTRAINT "_KnowledgePointToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
