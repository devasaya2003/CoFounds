import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FormActionsProps {
  hasUnsavedChanges: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  onCancel: () => void;
  isNewUser?: boolean;
  isMinimumComplete?: boolean;
  hasSkills?: boolean;
}

export function FormActions({ 
  hasUnsavedChanges, 
  isSubmitting, 
  onSave, 
  onCancel,
  isNewUser = false,
  isMinimumComplete = false,
  hasSkills = false
}: FormActionsProps) {
  const router = useRouter();
  
  return (
    <>
      {hasUnsavedChanges && (
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}

      {/* Add a "Continue to Dashboard" button for new users when minimum is complete */}
      {isNewUser && isMinimumComplete && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => router.push('/candidate/app')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {hasSkills ? "Continue to Dashboard" : "Continue (Adding Skills Recommended)"}
          </Button>
        </div>
      )}
    </>
  );
}