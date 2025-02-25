type DeleteQuestion = { action: "delete"; questionId: string };
type UpdateQuestion = { action: "update"; questionId: string; question: string };
type AddQuestion = { action: "add"; question: string };

export interface UpdateQuestions {
  updatedBy: string | null;
  actions: (DeleteQuestion | UpdateQuestion | AddQuestion)[];
}