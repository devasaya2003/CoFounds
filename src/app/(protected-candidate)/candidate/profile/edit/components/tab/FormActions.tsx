import { FormActions as FormActionsComponent } from "../FormActions";
import { ConfirmDialog } from "../ConfirmDialog";
import { FormManagementReturn } from "../../hooks/form";

interface FormActionsProps {
  formManagement: FormManagementReturn;
  isNewUser?: boolean;
}

export default function FormActions({
  formManagement,
  isNewUser = false
}: FormActionsProps) {
  const {
    hasUnsavedChanges,
    isSubmitting,
    handleSaveClick,
    handleCancelChanges,
    isPersonalInfoComplete,
    hasSkills,
    showConfirmDialog,
    setShowConfirmDialog,
    handleConfirmSave
  } = formManagement;

  return (
    <>
      <ConfirmDialog 
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmSave}
        isSubmitting={isSubmitting}
      />

      <FormActionsComponent 
        hasUnsavedChanges={hasUnsavedChanges}
        isSubmitting={isSubmitting}
        onSave={handleSaveClick}
        onCancel={handleCancelChanges}
        isNewUser={isNewUser}
        isMinimumComplete={isPersonalInfoComplete}
        hasSkills={hasSkills}
      />
    </>
  );
}