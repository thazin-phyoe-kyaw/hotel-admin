export interface DrawerProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  submitLabel?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: () => void;
}