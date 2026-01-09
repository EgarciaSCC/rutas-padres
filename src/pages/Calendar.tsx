import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Calendar as CalendarIcon, Filter, ChevronLeft, ChevronRight, AlertTriangle, Clock, Home, School, Bus, X, Plus, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { api } from "@/lib/api";

interface Novelty {
  id: number;
  date: Date;
  childIds: string[];
  note: string;
  status: "pending" | "confirmed" | "rejected";
  createdAt: Date;
}

// Los datos de hijos, schedules y exceptions se cargan desde el servicio mock

const Calendar = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedChild, setSelectedChild] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoveltyFormOpen, setIsNoveltyFormOpen] = useState(false);
  const [childrenList, setChildrenList] = useState<{ id: string; name: string }[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [exceptions, setExceptions] = useState<any[]>([]);
  const [loadingCalendarData, setLoadingCalendarData] = useState(true);
  const [noveltyNote, setNoveltyNote] = useState("");
  const [selectedChildrenForNovelty, setSelectedChildrenForNovelty] = useState<string[]>([]);
  const [novelties, setNovelties] = useState<Novelty[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoadingCalendarData(true);
    Promise.all([api.getChildren(), api.getSchedules(), api.getExceptions()])
      .then(([childrenRes, schedulesRes, exceptionsRes]) => {
        if (!mounted) return;
        const list = [{ id: "all", name: "Todos los hijos" }, ...childrenRes.map((c: any) => ({ id: c.id, name: c.name }))];
        setChildrenList(list);
        setSchedules(schedulesRes);
        setExceptions(exceptionsRes);
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingCalendarData(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const isException = (date: Date) => {
    return exceptions.some((ex) => isSameDay(ex.date, date));
  };

  const getException = (date: Date) => {
    return exceptions.find((ex) => isSameDay(ex.date, date));
  };

  const hasSchedule = (date: Date) => {
    return schedules.some((schedule) =>
      isSameDay(schedule.date, date) &&
      (selectedChild === "all" || schedule.childId === selectedChild)
    );
  };

  const getSchedulesForDate = (date: Date) => {
    return schedules.filter((schedule) =>
      isSameDay(schedule.date, date) &&
      (selectedChild === "all" || schedule.childId === selectedChild)
    );
  };

  const getNoveltiesForDate = (date: Date) => {
    return novelties.filter((n) => isSameDay(n.date, date));
  };

  const hasNovelty = (date: Date) => {
    return novelties.some((n) => isSameDay(n.date, date));
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const handleOpenNoveltyForm = () => {
    setIsNoveltyFormOpen(true);
    setSelectedChildrenForNovelty([]);
    setNoveltyNote("");
  };

  const handleToggleChildForNovelty = (childId: string) => {
    setSelectedChildrenForNovelty((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  const handleSubmitNovelty = () => {
    if (!selectedDate || selectedChildrenForNovelty.length === 0 || !noveltyNote.trim()) {
      toast({
        title: "Error",
        description: "Por favor selecciona al menos un estudiante y escribe una nota.",
        variant: "destructive",
      });
      return;
    }

    const newNovelty: Novelty = {
      id: Date.now(),
      date: selectedDate,
      childIds: selectedChildrenForNovelty,
      note: noveltyNote,
      status: "pending",
      createdAt: new Date(),
    };

    setNovelties((prev) => [...prev, newNovelty]);
    setIsNoveltyFormOpen(false);
    setNoveltyNote("");
    setSelectedChildrenForNovelty([]);

    toast({
      title: "Novedad enviada",
      description: "Tu solicitud está pendiente de confirmación por el administrador de la ruta.",
    });
  };

  const selectedDateSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];
  const selectedDateException = selectedDate ? getException(selectedDate) : null;
  const selectedDateNovelties = selectedDate ? getNoveltiesForDate(selectedDate) : [];

  const availableChildrenForNovelty = childrenList.filter((c) => c.id !== "all");

  return (
    <MobileLayout>
      <div className="px-4 py-2 space-y-4">
        {/* Filters */}
        <Card className="bg-card border-accent/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Filtros</span>
            </div>
            <Select value={selectedChild} onValueChange={setSelectedChild}>
              <SelectTrigger className="w-full bg-background border-accent/30 focus:ring-accent">
                <SelectValue placeholder="Seleccionar hijo" />
              </SelectTrigger>
              <SelectContent>
                {loadingCalendarData ? (
                  <SelectItem key="loading" value="all">Cargando...</SelectItem>
                ) : (
                  childrenList.map((child) => (
                    <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="text-accent hover:bg-accent/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="text-accent hover:bg-accent/10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <Card className="bg-card border-accent/20 overflow-hidden shadow-lg">
          <CardContent className="p-3">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-accent py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}
              {daysInMonth.map((day) => {
                const isExceptionDay = isException(day);
                const hasRoute = hasSchedule(day);
                const hasNoveltyDay = hasNovelty(day);
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={`
                      aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative transition-all
                      ${isTodayDate ? "ring-2 ring-accent bg-accent/10 font-bold" : ""}
                      ${isExceptionDay ? "bg-destructive/15 text-destructive" : ""}
                      ${hasRoute && !isExceptionDay ? "bg-accent/10" : ""}
                      ${!isExceptionDay && !hasRoute ? "hover:bg-accent/5" : ""}
                    `}
                  >
                    <span>{format(day, "d")}</span>
                    <div className="absolute bottom-0.5 flex gap-0.5">
                      {hasRoute && !isExceptionDay && (
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                      {hasNoveltyDay && (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                      {isExceptionDay && (
                        <AlertTriangle className="w-3 h-3 text-destructive" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-muted-foreground">Ruta programada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Novedad</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-destructive" />
            <span className="text-muted-foreground">Sin operación</span>
          </div>
        </div>

        {/* Upcoming Exceptions */}
        <div className="space-y-3 pb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            Próximas excepciones
          </h3>
          {exceptions.map((exception) => (
            <Card key={exception.id} className="bg-card border-border">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-destructive">
                    {format(exception.date, "d")}
                  </span>
                  <span className="text-[10px] text-destructive uppercase">
                    {format(exception.date, "MMM", { locale: es })}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{exception.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(exception.date, "EEEE", { locale: es })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Date Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-accent capitalize">
                {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Exception Alert */}
            {selectedDateException && (
              <Card className="bg-destructive/10 border-destructive/30">
                <CardContent className="p-3 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive">Sin operación</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedDateException.reason}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Novelties for this date */}
            {selectedDateNovelties.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-amber-600 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Novedades registradas
                </h4>
                {selectedDateNovelties.map((novelty) => (
                  <Card key={novelty.id} className="bg-amber-50 border-amber-200">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{novelty.note}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Estudiantes: {novelty.childIds.map((id) =>
                              availableChildrenForNovelty.find((c) => c.id === id)?.name
                            ).join(", ")}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`shrink-0 ${
                            novelty.status === "pending"
                              ? "border-amber-500 text-amber-600 bg-amber-50"
                              : novelty.status === "confirmed"
                              ? "border-green-500 text-green-600 bg-green-50"
                              : "border-red-500 text-red-600 bg-red-50"
                          }`}
                        >
                          {novelty.status === "pending" && "Pendiente"}
                          {novelty.status === "confirmed" && "Confirmada"}
                          {novelty.status === "rejected" && "Rechazada"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Schedules */}
            {selectedDateSchedules.length > 0 && !selectedDateException && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-accent flex items-center gap-2">
                  <Bus className="w-4 h-4" />
                  Rutas programadas
                </h4>
                {selectedDateSchedules.map((schedule) => (
                  <Card key={schedule.id} className="bg-accent/5 border-accent/20">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                            <Bus className="w-4 h-4 text-accent-foreground" />
                          </div>
                          <span className="font-medium text-foreground">
                            {schedule.childName}
                          </span>
                        </div>
                        <Badge className="bg-accent text-accent-foreground">
                          {schedule.type === "morning" ? "Mañana" : "Tarde"}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">{schedule.route}</p>

                      <Separator className="bg-accent/20" />

                      {schedule.type === "morning" ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                              <Home className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Recogida en casa</p>
                              <p className="font-semibold text-foreground">{schedule.pickupTime}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                              <Clock className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Salida del bus</p>
                              <p className="font-semibold text-foreground">{schedule.departureTime}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                              <School className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Llegada al colegio</p>
                              <p className="font-semibold text-foreground">{schedule.arrivalSchool}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                              <School className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Salida del colegio</p>
                              <p className="font-semibold text-foreground">{schedule.departureSchool}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                              <Home className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Llegada a casa</p>
                              <p className="font-semibold text-foreground">{schedule.arrivalHome}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {selectedDateSchedules.length === 0 && !selectedDateException && (
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-6 text-center">
                  <CalendarIcon className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No hay rutas programadas para este día
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Novelty Form */}
            {isNoveltyFormOpen ? (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-amber-700">Nueva novedad</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsNoveltyFormOpen(false)}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">
                      Selecciona los estudiantes
                    </Label>
                    {availableChildrenForNovelty.map((child) => (
                      <div key={child.id} className="flex items-center gap-3">
                        <Checkbox
                          id={`novelty-${child.id}`}
                          checked={selectedChildrenForNovelty.includes(child.id)}
                          onCheckedChange={() => handleToggleChildForNovelty(child.id)}
                          className="border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                        />
                        <Label htmlFor={`novelty-${child.id}`} className="text-sm cursor-pointer">
                          {child.name}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Motivo de la ausencia
                    </Label>
                    <Textarea
                      placeholder="Ej: El estudiante no asistirá por cita médica..."
                      value={noveltyNote}
                      onChange={(e) => setNoveltyNote(e.target.value)}
                      className="resize-none border-amber-300 focus:ring-amber-400"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitNovelty}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Enviar novedad
                  </Button>

                  <p className="text-xs text-amber-600 text-center">
                    La novedad quedará pendiente de confirmación por el administrador de la ruta.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Button
                onClick={handleOpenNoveltyForm}
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar novedad de ausencia
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default Calendar;
