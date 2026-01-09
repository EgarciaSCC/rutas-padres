import { useState, useEffect } from "react";
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
import { api } from "@/lib/api";
import { statusFilters as statusFiltersData } from "@/mocks/mocksData";

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

// children se cargan desde mocks via api.getChildren
// El componente añadirá una opción "all" localmente

// Mapeo simple para convertir el nombre del icono (string) a componente lucide
const iconMap: Record<string, any> = {
  Route,
  CheckCircle,
  XCircle,
  UserX,
};

const History = () => {
  const [childrenList, setChildrenList] = useState<{ id: string; name: string }[]>([]);
  const [history, setHistory] = useState<RouteHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getChildren().then((res) => {
      if (!mounted) return;
      const list = [{ id: "all", name: "Todos los hijos" }, ...res.map((c) => ({ id: c.id, name: c.name }))];
      setChildrenList(list);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRoute, setSelectedRoute] = useState<RouteHistory | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.queryRouteHistory({ childId: selectedChild, status: selectedStatus }).then((res) => {
      if (!mounted) return;
      setHistory(res);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [selectedChild, selectedStatus]);

  const filteredHistory = history; // already filtered server-side (simulado)

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
                {statusFiltersData.map((filter) => {
                  const Icon = iconMap[filter.icon as string] ?? Route;
                  return (
                    <Button
                      key={filter.id}
                      variant={selectedStatus === filter.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStatus(filter.id)}
                      className="text-xs gap-1"
                    >
                      <Icon className="w-3 h-3" />
                      {filter.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-3">
          {loading ? "Cargando..." : `${filteredHistory.length} ruta${filteredHistory.length !== 1 ? "s" : ""} encontrada${filteredHistory.length !== 1 ? "s" : ""}`}
        </p>

        {/* Route History List */}
        <div className="space-y-3">
          {loading ? null : filteredHistory.map((route) => {
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

        {!loading && filteredHistory.length === 0 && (
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
                            <p className="text-sm text-muted-foreground">{stop.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Novelties */}
              {selectedRoute.novelties.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Novedades</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {selectedRoute.novelties.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
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

