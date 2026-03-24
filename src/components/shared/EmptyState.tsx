import { FileX } from 'lucide-react';

const EmptyState = ({ title = 'Nothing here yet', message = 'Check back later.' }: { title?: string; message?: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <FileX className="w-16 h-16 text-muted-foreground/30 mb-4" />
    <h3 className="font-display font-semibold text-lg text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export default EmptyState;
