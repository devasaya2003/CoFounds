import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { StatusMessage } from "./types";

interface StatusAlertProps {
  status: StatusMessage | null;
  isRefetching?: boolean;
  hasUnsavedChanges?: boolean;
}

export function StatusAlert({ status, isRefetching, hasUnsavedChanges }: StatusAlertProps) {
  const getStatusStyles = (type: StatusMessage['type']) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          className: "bg-green-50 border-green-200 text-green-800"
        };
      case 'error':
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          className: "bg-red-50 border-red-200 text-red-800"
        };
      case 'warning':
        return {
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
          className: "bg-amber-50 border-amber-200 text-amber-800"
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-blue-500" />,
          className: "bg-blue-50 border-blue-200 text-blue-800"
        };
    }
  };

  return (
    <>
      {/* Status message alert */}
      {status && (
        <div className="mb-4">
          <Alert className={getStatusStyles(status.type).className}>
            <div className="flex items-center">
              {getStatusStyles(status.type).icon}
              <AlertDescription className="ml-2">{status.message}</AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      {/* Add refetching indicator */}
      {isRefetching && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-2" />
          <span className="text-blue-700 text-sm">Refreshing profile data...</span>
        </div>
      )}

      {hasUnsavedChanges && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
          <span className="text-amber-700">
            You have unsaved changes. Please save or cancel your changes before switching tabs.
          </span>
        </div>
      )}
    </>
  );
}