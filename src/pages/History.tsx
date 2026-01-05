import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Bus,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  UserX,
  ChevronRight,
  Filter,
  Route
} from "lucide-react";

interface RouteStop {
  location: string;
  time: string;
  type: "pickup" | "dropoff" | "school";
}

interface RouteHistory {
  id: string;
  date: string;
  childId: string;
  childName: string;
  type: "ida" | "regreso";
  status: "completed" | "cancelled" | "no_show";
  departureTime: string;
  arrivalTime: string;
  totalDuration: string;
  stops: RouteStop[];
  novelties: string[];
}

const childrenList = [
  { id: "all", name: "Todos los hijos" },
  { id: "alfonso", name: "Alfonso Miguel" },
  { id: "luis", name: "Luis José" },
];

const statusFilters = [
  { id: "all", label: "Todas", icon: Route },
  { id: "completed", label: "Completadas", icon: CheckCircle },
  { id: "cancelled", label: "Canceladas", icon: XCircle },
  { id: "no_show", label: "No abordó", icon: UserX },
];

const mockHistory: RouteHistory[] = [
  {
    id: "1",
    date: "2024-01-15",
    childId: "luis",
    childName: "Luis José",
    type: "ida",
    status: "completed",
    departureTime: "6:15 AM",
    arrivalTime: "7:00 AM",
    totalDuration: "45 min",
    stops: [
      { location: "Casa - Calle 85 #15-30", time: "6:15 AM", type: "pickup" },
      { location: "Parada Av. 9na", time: "6:25 AM", type: "pickup" },
      { location: "Parada Calle 100", time: "6:40 AM", type: "pickup" },
      { location: "Colegio Buckingham", time: "7:00 AM", type: "school" },
    ],
    novelties: [],
  },
  {
    id: "2",
    date: "2024-01-15",
    childId: "alfonso",
    childName: "Alfonso Miguel",
    type: "ida",
    status: "completed",
    departureTime: "6:15 AM",
    arrivalTime: "7:00 AM",
    totalDuration: "45 min",
    stops: [
      { location: "Casa - Calle 85 #15-30", time: "6:15 AM", type: "pickup" },
      { location: "Parada Av. 9na", time: "6:25 AM", type: "pickup" },
      { location: "Colegio Buckingham", time: "7:00 AM", type: "school" },
    ],
    novelties: [],
  },
  {
    id: "3",
    date: "2024-01-14",
    childId: "luis",
    childName: "Luis José",
    type: "regreso",
    status: "completed",
    departureTime: "3:00 PM",
    arrivalTime: "3:50 PM",
    totalDuration: "50 min",
    stops: [
      { location: "Colegio Buckingham", time: "3:00 PM", type: "school" },
      { location: "Parada Calle 100", time: "3:20 PM", type: "dropoff" },
      { location: "Casa - Calle 85 #15-30", time: "3:50 PM", type: "dropoff" },
    ],
    novelties: ["Retraso de 10 minutos por tráfico en Av. 9na"],
  },
  {
    id: "4",
    date: "2024-01-12",
    childId: "alfonso",
    childName: "Alfonso Miguel",
    type: "ida",
    status: "cancelled",
    departureTime: "6:15 AM",
    arrivalTime: "-",
    totalDuration: "-",
    stops: [],
    novelties: ["Ruta cancelada por condiciones climáticas adversas"],
  },
  {
    id: "5",
    date: "2024-01-11",
    childId: "luis",
    childName: "Luis José",
    type: "regreso",
    status: "no_show",
    departureTime: "3:00 PM",
    arrivalTime: "3:45 PM",
    totalDuration: "45 min",
    stops: [
      { location: "Colegio Buckingham", time: "3:00 PM", type: "school" },
      { location: "Parada Calle 100", time: "3:20 PM", type: "dropoff" },
      { location: "Casa - Calle 85 #15-30", time: "3:45 PM", type: "dropoff" },
    ],
    novelties: ["El estudiante no abordó el bus - Recogido por familiar"],
  },
  {
    id: "6",
    date: "2024-01-10",
    childId: "alfonso",
    childName: "Alfonso Miguel",
    type: "regreso",
    status: "completed",
    departureTime: "3:00 PM",
    arrivalTime: "3:55 PM",
    totalDuration: "55 min",
    stops: [
      { location: "Colegio Buckingham", time: "3:00 PM", type: "school" },
      { location: "Parada Av. 9na", time: "3:30 PM", type: "dropoff" },
      { location: "Casa - Calle 85 #15-30", time: "3:55 PM", type: "dropoff" },
    ],
    novelties: [],
  },
];

const History = () => {
  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRoute, setSelectedRoute] = useState<RouteHistory | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredHistory = mockHistory.filter((route) => {
    const matchChild = selectedChild === "all" || route.childId === selectedChild;
    const matchStatus = selectedStatus === "all" || route.status === selectedStatus;
    return matchChild && matchStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Completada",
          color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          icon: CheckCircle
        };
      case "cancelled":
        return {
          label: "Cancelada",
          color: "bg-destructive/10 text-destructive",
          icon: XCircle
        };
      case "no_show":
        return {
          label: "No abordó",
          color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          icon: UserX
        };
      default:
        return {
          label: status,
          color: "bg-muted text-muted-foreground",
          icon: Bus
        };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <MobileLayout>
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-card rounded-2xl p-4 mb-4 space-y-4 animate-fade-in border border-border">
            {/* Child Filter */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Estudiante</p>
              <div className="flex flex-wrap gap-2">
                {childrenList.map((child) => (
                  <Button
                    key={child.id}
                    variant={selectedChild === child.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedChild(child.id)}
                    className="text-xs"
                  >
                    {child.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Estado</p>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={selectedStatus === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(filter.id)}
                    className="text-xs gap-1"
                  >
                    <filter.icon className="w-3 h-3" />
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-3">
          {filteredHistory.length} ruta{filteredHistory.length !== 1 ? "s" : ""} encontrada{filteredHistory.length !== 1 ? "s" : ""}
        </p>

        {/* Route History List */}
        <div className="space-y-3">
          {filteredHistory.map((route) => {
            const statusConfig = getStatusConfig(route.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className="bg-card rounded-2xl p-4 border border-border cursor-pointer hover:border-primary/50 transition-colors animate-fade-in"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="icon-circle flex-shrink-0">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{route.childName}</p>
                      <p className="text-sm text-muted-foreground">
                        Ruta de {route.type === "ida" ? "ida" : "regreso"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(route.date)}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {route.departureTime}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                  </span>
                  {route.novelties.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {route.novelties.length} novedad{route.novelties.length > 1 ? "es" : ""}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No se encontraron rutas con los filtros seleccionados</p>
          </div>
        )}
      </div>

      {/* Route Detail Modal */}
      <Dialog open={!!selectedRoute} onOpenChange={() => setSelectedRoute(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bus className="w-5 h-5 text-primary" />
              Detalle de Ruta
            </DialogTitle>
          </DialogHeader>

          {selectedRoute && (
            <div className="space-y-5">
              {/* Route Info */}
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{selectedRoute.childName}</p>
                    <p className="text-sm text-muted-foreground">
                      Ruta de {selectedRoute.type === "ida" ? "ida al colegio" : "regreso a casa"}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusConfig(selectedRoute.status).color}`}>
                    {getStatusConfig(selectedRoute.status).label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-background rounded-lg p-2">
                    <Calendar className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Fecha</p>
                    <p className="text-sm font-medium">{formatDate(selectedRoute.date)}</p>
                  </div>
                  <div className="bg-background rounded-lg p-2">
                    <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Salida</p>
                    <p className="text-sm font-medium">{selectedRoute.departureTime}</p>
                  </div>
                  <div className="bg-background rounded-lg p-2">
                    <Route className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Duración</p>
                    <p className="text-sm font-medium">{selectedRoute.totalDuration}</p>
                  </div>
                </div>
              </div>

              {/* Route Stops */}
              {selectedRoute.stops.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Trayecto
                  </h3>
                  <div className="relative">
                    {selectedRoute.stops.map((stop, index) => (
                      <div key={index} className="flex gap-3 pb-4 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            stop.type === "school"
                              ? "bg-primary"
                              : stop.type === "pickup"
                                ? "bg-green-500"
                                : "bg-accent"
                          }`} />
                          {index < selectedRoute.stops.length - 1 && (
                            <div className="w-0.5 flex-1 bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground truncate pr-2">
                              {stop.location}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {stop.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {stop.type === "pickup" && "Recogida"}
                            {stop.type === "dropoff" && "Entrega"}
                            {stop.type === "school" && "Colegio"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Novelties */}
              {selectedRoute.novelties.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Novedades
                  </h3>
                  <div className="space-y-2">
                    {selectedRoute.novelties.map((novelty, index) => (
                      <div
                        key={index}
                        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3"
                      >
                        <p className="text-sm text-amber-800 dark:text-amber-200">{novelty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Arrival Info */}
              {selectedRoute.status === "completed" && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="font-medium text-green-700 dark:text-green-300">Ruta completada</p>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Llegada a las {selectedRoute.arrivalTime}
                  </p>
                </div>
              )}

              {selectedRoute.status === "cancelled" && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="w-4 h-4 text-destructive" />
                    <p className="font-medium text-destructive">Ruta cancelada</p>
                  </div>
                  <p className="text-sm text-destructive/80">
                    Esta ruta fue cancelada y no se realizó
                  </p>
                </div>
              )}

              {selectedRoute.status === "no_show" && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <UserX className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <p className="font-medium text-amber-700 dark:text-amber-300">Estudiante no abordó</p>
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    El estudiante no subió al bus en esta ruta
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default History;