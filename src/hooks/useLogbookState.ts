import { useReducer, createContext, useContext } from "react";
import { cleanRoomFormFields, phConductivityFormFields, type FormField, type SyncEntry, mockSyncQueue } from "@/data/mockLogbooks";

const formFieldsByLogbook: Record<string, FormField[]> = {
  "1": cleanRoomFormFields,
  "4": phConductivityFormFields,
};

interface LogbookState {
  selectedLogbookId: string | null;
  formFields: FormField[];
  confirmedFields: Set<string>;
  isOffline: boolean;
  syncQueue: SyncEntry[];
  isSigning: boolean;
  showSuccess: boolean;
}

type Action =
  | { type: "SELECT_LOGBOOK"; id: string }
  | { type: "UPDATE_FIELD"; fieldId: string; value: string }
  | { type: "CONFIRM_FIELD"; fieldId: string }
  | { type: "SIGN_ENTRY" }
  | { type: "SHOW_SUCCESS" }
  | { type: "HIDE_SUCCESS" }
  | { type: "TOGGLE_OFFLINE" }
  | { type: "OPEN_SIGN" }
  | { type: "CLOSE_SIGN" }
  | { type: "RESET_FORM" };

const initialState: LogbookState = {
  selectedLogbookId: null,
  formFields: cleanRoomFormFields,
  confirmedFields: new Set<string>(),
  isOffline: false,
  syncQueue: mockSyncQueue,
  isSigning: false,
  showSuccess: false,
};

function logbookReducer(state: LogbookState, action: Action): LogbookState {
  switch (action.type) {
    case "SELECT_LOGBOOK":
      return { ...state, selectedLogbookId: action.id, formFields: formFieldsByLogbook[action.id] ?? cleanRoomFormFields, confirmedFields: new Set() };
    case "UPDATE_FIELD":
      return {
        ...state,
        formFields: state.formFields.map((f) =>
          f.id === action.fieldId ? { ...f, value: action.value } : f
        ),
      };
    case "CONFIRM_FIELD":
      return {
        ...state,
        confirmedFields: new Set([...state.confirmedFields, action.fieldId]),
      };
    case "OPEN_SIGN":
      return { ...state, isSigning: true };
    case "CLOSE_SIGN":
      return { ...state, isSigning: false };
    case "SIGN_ENTRY":
      return { ...state, isSigning: false, showSuccess: true };
    case "SHOW_SUCCESS":
      return { ...state, showSuccess: true };
    case "HIDE_SUCCESS":
      return { ...state, showSuccess: false };
    case "TOGGLE_OFFLINE":
      return { ...state, isOffline: !state.isOffline };
    case "RESET_FORM":
      return { ...state, formFields: cleanRoomFormFields, confirmedFields: new Set(), showSuccess: false };
    default:
      return state;
  }
}

export function useLogbookState() {
  const [state, dispatch] = useReducer(logbookReducer, initialState);
  return { state, dispatch };
}

export const LogbookContext = createContext<{
  state: LogbookState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function useLogbook() {
  const ctx = useContext(LogbookContext);
  if (!ctx) throw new Error("useLogbook must be used within LogbookContext.Provider");
  return ctx;
}
