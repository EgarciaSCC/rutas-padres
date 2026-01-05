import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import RouteEventItem from "@/components/routes/RouteEventItem";
import RouteMap from "@/components/routes/RouteMap";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const childrenData: Record<string, { name: string; displayName: string }> = {
  alfonso: { name: "Alfono Miguel Lopez Pumarejo", displayName: "Alfono" },
  luis: { name: "Luis José Lopez Pumarejo", displayName: "Luis Lopez" },
};

const initialRouteEvents = [
  { message: "Luis José abordó el bus", time: "05:50 pm" },
  { message: "Luis José abordó el bus", time: "05:50 pm" },
  { message: "El bus llegó al colegio", time: "05:43 pm" },
  { message: "El bus está en 2 paradas", time: "05:30 pm" },
  { message: "El bus está en 3 paradas", time: "05:23 pm" },
];

const RouteDetailPage = () => {
  const { childId } = useParams<{ childId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get("tab") === "history" ? "history" : "map";
  const [activeTab, setActiveTab] = useState(initialTab);
  // Control global de visibilidad de eventos; el toggle se mostrará en el tab Mapa
  const [showEvents, setShowEvents] = useState(true);
  // Lista dinámica de eventos (permite cerrar individualmente desde el tab mapa)
  const [events, setEvents] = useState(initialRouteEvents);

  const child = childrenData[childId || "luis"] || childrenData.luis;

  // Simulated bus location (Bogotá area)
  const [busLocation] = useState({ lat: 4.7247, lng: -74.0547 });
  const homeLocation = { lat: 4.7150, lng: -74.0600 };

  return (
    <MobileLayout showHeader={true}>
      <div className="flex flex-col h-full">
        {/* Header section */}
        <div className="px-4 py-2">
          <h1 className="text-2xl font-bold text-foreground">
            Ruta de <span className="text-primary">{child.displayName}</span>
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
            <button onClick={() => navigate("/")} className="hover:text-primary transition-colors">
              Rutas
            </button>
            <span>/</span>
            <span>Ruta de {child.displayName}</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 bg-transparent justify-start gap-6 h-auto p-0 mb-4">
            <TabsTrigger
              value="history"
              className="px-0 pb-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-primary font-semibold"
            >
              Historial
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="px-0 pb-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-primary font-semibold"
            >
              Mapa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="flex-1 px-4 mt-0">
            {/* Historial: lista de eventos (restaurada a su estado original) */}
            <div className="bg-card rounded-2xl p-4 shadow-card mr-12 md:mr-20 w-[85%]">
              {events.map((event, index) => (
                <RouteEventItem
                  key={index}
                  message={event.message}
                  time={event.time}
                  isLast={index === events.length - 1}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="flex-1 mt-0 relative">
            <RouteMap
              busLocation={busLocation}
              homeLocation={homeLocation}
              lastUpdate="01/04/2025 06:37:08"
              distanceToHome="2,3km"
              events={events}
              showEvents={showEvents}
              toggleShowEvents={() => setShowEvents((v) => !v)}
              onCloseEvent={(index: number) => setEvents((prev) => prev.filter((_, i) => i !== index))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default RouteDetailPage;
