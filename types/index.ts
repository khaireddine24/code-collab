export interface Sheet {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    owner_id: string;
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
  }

  export interface ConfirmDeleteDialogProps {
    onConfirm: () => void;
    onCancel: () => void;
    title:string;
  }