import { Bus, X } from "lucide-react";

interface RouteEventItemProps {
  message: string;
  time: string;
  isLast?: boolean;
  onClose?: () => void;
}

const RouteEventItem = ({ message, time, isLast = false, onClose }: RouteEventItemProps) => {
  return (
    <div className={`flex items-center gap-4 py-3 ${!isLast ? "border-b border-border" : ""} animate-fade-in`}>
      <div className="icon-circle flex-shrink-0">
        <Bus className="w-6 h-6" />
      </div>

      <div className="flex-1">
        <p className="text-foreground font-medium text-sm">{message}</p>
        <p className="text-muted-foreground text-sm">Hora: {time}</p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cerrar evento"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default RouteEventItem;
