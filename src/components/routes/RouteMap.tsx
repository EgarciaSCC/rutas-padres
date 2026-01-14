import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Crosshair, Home, Bus, Eye, EyeOff } from "lucide-react";
import RouteEventItem from "@/components/routes/RouteEventItem";

mapboxgl.accessToken = "pk.eyJ1IjoiZXNuZWlkZXJnZyIsImEiOiJjbWo5N3F1MmwwOGR0M2ZvOHRnOTU3djg4In0.X6ESalQHbXIrN4pdrADtqQ";

interface RouteMapProps {
  busLocation: { lat: number; lng: number };
  homeLocation: { lat: number; lng: number };
  lastUpdate: string;
  distanceToHome: string;
  // Events and controls passed from parent
  events?: { message: string; time: string }[];
  showEvents?: boolean;
  toggleShowEvents?: () => void;
  onCloseEvent?: (index: number) => void;
  loading?: boolean;
}

const RouteMap = ({
  busLocation,
  homeLocation,
  lastUpdate,
  distanceToHome,
  events = [],
  showEvents = true,
  toggleShowEvents,
  onCloseEvent,
  loading = false,
}: RouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const busMarker = useRef<mapboxgl.Marker | null>(null);
  const homeMarker = useRef<mapboxgl.Marker | null>(null);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [busLocation.lng, busLocation.lat],
      zoom: 14,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: false }),
      "top-right"
    );

    // Create custom bus marker
    const busEl = document.createElement("div");
    busEl.className = "bus-marker";
    busEl.innerHTML = `
      <div style="
        width: 48px;
        height: 48px;
        background: #610CF4;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px -2px rgba(97,12,244,0.5);
        animation: pulse-soft 2s ease-in-out infinite;
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 6v6"/>
          <path d="M15 6v6"/>
          <path d="M2 12h19.6"/>
          <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
          <circle cx="7" cy="18" r="2"/>
          <path d="M9 18h5"/>
          <circle cx="16" cy="18" r="2"/>
        </svg>
      </div>
    `;

    busMarker.current = new mapboxgl.Marker({ element: busEl })
      .setLngLat([busLocation.lng, busLocation.lat])
      .addTo(map.current);

    // Create custom home marker
    const homeEl = document.createElement("div");
    homeEl.className = "home-marker";
    homeEl.innerHTML = `
      <div style="
        width: 48px;
        height: 48px;
        background: hsl(270 60% 55%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px -2px hsl(270 60% 55% / 0.5);
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
    `;

    homeMarker.current = new mapboxgl.Marker({ element: homeEl })
      .setLngLat([homeLocation.lng, homeLocation.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px; text-align: center;">
            <strong>Último registro</strong><br/>
            <span style="color: #666;">${lastUpdate}</span>
          </div>
        `)
      )
      .addTo(map.current);

    // Fit bounds to show both markers
    const bounds = new mapboxgl.LngLatBounds()
      .extend([busLocation.lng, busLocation.lat])
      .extend([homeLocation.lng, homeLocation.lat]);

    // Use asymmetric padding so top-right map controls are visible (right padding increased)
    map.current.fitBounds(bounds, { padding: { top: 80, right: 120, bottom: 80, left: 80 } });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update bus marker position
  useEffect(() => {
    if (busMarker.current) {
      busMarker.current.setLngLat([busLocation.lng, busLocation.lat]);
    }
  }, [busLocation]);

  // Update home marker position and refit bounds when either location changes
  useEffect(() => {
    if (!map.current) return;

    // update or create home marker
    if (homeMarker.current) {
      homeMarker.current.setLngLat([homeLocation.lng, homeLocation.lat]);
    } else {
      const homeEl = document.createElement("div");
      homeEl.className = "home-marker";
      homeEl.innerHTML = `
        <div style="
          width: 48px;
          height: 48px;
          background: hsl(270 60% 55%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px -2px hsl(270 60% 55% / 0.5);
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
      `;

      homeMarker.current = new mapboxgl.Marker({ element: homeEl })
        .setLngLat([homeLocation.lng, homeLocation.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px; text-align: center;">
              <strong>Último registro</strong><br/>
              <span style="color: #666;">${lastUpdate}</span>
            </div>
          `)
        )
        .addTo(map.current);
    }

    // Refit bounds to show both markers when locations update
    try {
      const bounds = new mapboxgl.LngLatBounds()
        .extend([busLocation.lng, busLocation.lat])
        .extend([homeLocation.lng, homeLocation.lat]);

      map.current.fitBounds(bounds, { padding: { top: 80, right: 120, bottom: 80, left: 80 } });
    } catch (e) {
      // ignore errors if locations are invalid
    }
  }, [homeLocation, busLocation, lastUpdate]);

  const centerOnBus = () => {
    map.current?.flyTo({
      center: [busLocation.lng, busLocation.lat],
      zoom: 15,
      duration: 1000,
    });
  };

  return (
    <div className="relative w-full h-full min-h-[75vh] md:min-h-[400px]">
      {/* Add right padding so Mapbox controls positioned at top-right are inset and visible */}
      <div ref={mapContainer} className="absolute inset-0 rounded-t-2xl pr-12 md:pr-20" />

      {/* Loading overlay shown while locations are being fetched */}
      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-card/70 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75" />
            </svg>
            <span className="mt-3 text-sm text-foreground">Cargando ubicación…</span>
          </div>
        </div>
      )}

      {/* Toggle de visibilidad de eventos (mostrar/ocultar)
      {toggleShowEvents && (
        <div className="absolute top-4 right-4 z-30">
          <button
            type="button"
            onClick={toggleShowEvents}
            className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showEvents ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{showEvents ? "Ocultar eventos" : "Mostrar eventos"}</span>
          </button>
        </div>
      )} */}

      {/* Panel de eventos (ancho 85%) mostrado en la pestaña Mapa
      {showEvents && events && events.length > 0 && (
        <div className="absolute top-16 left-4 z-20 w-[85%] bg-card rounded-2xl p-4 shadow-card">
          {events.map((event, index) => (
            <RouteEventItem
              key={index}
              message={event.message}
              time={event.time}
              isLast={index === events.length - 1}
              onClose={onCloseEvent ? () => onCloseEvent(index) : undefined}
            />
          ))}
        </div>
      )} */}

      {/* Notification Toast */}
      {showNotification && (
        <div className="absolute top-4 left-4 right-4 bg-card rounded-2xl p-4 shadow-card animate-slide-up z-10 w-85p">
          <div className="flex items-center gap-3">
            <div className="icon-circle flex-shrink-0">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Hemos comenzado el recorrido a casa</p>
              <p className="text-muted-foreground text-sm">Hora: 06:00 pm</p>
            </div>
          </div>
        </div>
      )}

      {/* Center on bus button */}
      <button
        onClick={centerOnBus}
        className="absolute bottom-24 right-4 w-14 h-14 bg-primary rounded-full shadow-button flex items-center justify-center text-primary-foreground hover:bg-coral-dark transition-colors z-10"
      >
        <Crosshair className="w-6 h-6" />
      </button>

      {/* Distance indicator */}
      <div className="absolute bottom-0 left-0 right-0 bg-accent py-4 px-6 flex items-center justify-center gap-3 z-10">
        <Home className="w-6 h-6 text-accent-foreground" />
        <span className="text-accent-foreground font-bold text-lg">{distanceToHome} de casa</span>
      </div>
    </div>
  );
};

export default RouteMap;
