import defaultUser from "@/assets/defaultUser.png";
import historyIcon from "@/assets/history.svg";
import homeIcon from "@/assets/home.svg";
import calendarIcon from "@/assets/calendar.svg";
import schoolbusIcon from "@/assets/schoolbus.svg";
import userprofileIcon from "@/assets/user-profile.svg";

export interface Child {
  id: string;
  name: string;
  displayName?: string;
  school: string;
  grade: string;
  imageUrl: string;
}

export interface RouteEvent {
  message: string;
  time: string;
}

export interface RouteStop {
  location: string;
  time: string;
  type: "pickup" | "dropoff" | "school";
}

export interface RouteHistory {
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

export const children: Child[] = [
  {
    id: "alfonso",
    name: "Alfono Miguel Lopez Pumarejo",
    displayName: "Alfono",
    school: "Colegio Bilingue Buckingham",
    grade: "8vo grado",
    imageUrl: defaultUser,
  },
  {
    id: "luis",
    name: "Luis José Lopez Pumarejo",
    displayName: "Luis Lopez",
    school: "Colegio Bilingue Buckingham",
    grade: "4to primaria",
    imageUrl: defaultUser,
  },
];

export const childrenMap: Record<string, Child> = children.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {} as Record<string, Child>);

export const routeEventsByChild: Record<string, RouteEvent[]> = {
  luis: [
    { message: "Luis José abordó el bus", time: "05:50 pm" },
    { message: "Luis José abordó el bus", time: "05:50 pm" },
    { message: "El bus llegó al colegio", time: "05:43 pm" },
    { message: "El bus está en 2 paradas", time: "05:30 pm" },
    { message: "El bus está en 3 paradas", time: "05:23 pm" },
  ],
  alfonso: [
    { message: "Alfonso abordó el bus", time: "06:00 pm" },
    { message: "El bus llegó al colegio", time: "05:55 pm" },
  ],
};

export const mockHistory: RouteHistory[] = [
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

// Calendario: schedules y excepciones. Las fechas se guardan como ISO strings
// para facilitar la serialización; el cliente `api` las convertirá a Date.
export const routeSchedules = [
  {
    id: 1,
    childId: "alfonso",
    childName: "Alfonso Miguel",
    date: "2026-01-05",
    type: "morning",
    departureTime: "6:00 AM",
    pickupTime: "6:30 AM",
    arrivalSchool: "7:15 AM",
    route: "Ruta Norte - Bus #12",
  },
  {
    id: 2,
    childId: "alfonso",
    childName: "Alfonso Miguel",
    date: "2026-01-05",
    type: "afternoon",
    departureSchool: "2:30 PM",
    arrivalHome: "3:15 PM",
    route: "Ruta Norte - Bus #12",
  },
  {
    id: 3,
    childId: "luis",
    childName: "Luis José",
    date: "2026-01-05",
    type: "morning",
    departureTime: "6:00 AM",
    pickupTime: "6:45 AM",
    arrivalSchool: "7:30 AM",
    route: "Ruta Sur - Bus #8",
  },
  {
    id: 4,
    childId: "luis",
    childName: "Luis José",
    date: "2026-01-05",
    type: "afternoon",
    departureSchool: "2:00 PM",
    arrivalHome: "2:45 PM",
    route: "Ruta Sur - Bus #8",
  },
  {
    id: 5,
    childId: "alfonso",
    childName: "Alfonso Miguel",
    date: "2026-01-07",
    type: "morning",
    departureTime: "6:00 AM",
    pickupTime: "6:30 AM",
    arrivalSchool: "7:15 AM",
    route: "Ruta Norte - Bus #12",
  },
  {
    id: 6,
    childId: "luis",
    childName: "Luis José",
    date: "2026-01-07",
    type: "morning",
    departureTime: "6:00 AM",
    pickupTime: "6:45 AM",
    arrivalSchool: "7:30 AM",
    route: "Ruta Sur - Bus #8",
  },
  {
    id: 7,
    childId: "alfonso",
    childName: "Alfonso Miguel",
    date: "2026-01-08",
    type: "morning",
    departureTime: "6:00 AM",
    pickupTime: "6:30 AM",
    arrivalSchool: "7:15 AM",
    route: "Ruta Norte - Bus #12",
  },
  {
    id: 8,
    childId: "luis",
    childName: "Luis José",
    date: "2026-01-09",
    type: "afternoon",
    departureSchool: "2:00 PM",
    arrivalHome: "2:45 PM",
    route: "Ruta Sur - Bus #8",
  },
];

export const exceptions = [
  {
    id: 1,
    date: "2026-01-06",
    reason: "Día festivo - Reyes Magos",
    affectsAll: true,
  },
  {
    id: 2,
    date: "2026-01-12",
    reason: "Reunión de padres - Sin transporte",
    affectsAll: true,
  },
  {
    id: 3,
    date: "2026-01-20",
    reason: "Mantenimiento de buses",
    affectsAll: true,
  },
];

// Nav items used in the bottom navigation (UI config)
export const navItems = [
  { icon: schoolbusIcon, label: "Rutas", path: "/routes" },
  { icon: historyIcon, label: "Historico", path: "/history" },
  { icon: homeIcon, label: "Home", path: "/", isCenter: true },
  { icon: calendarIcon, label: "Calendario", path: "/calendar" },
  { icon: userprofileIcon, label: "Cuenta", path: "/account" },
];

// Status filters for History page (icon keys will be mapped to components in the UI file)
export const statusFilters = [
  { id: "all", label: "Todas", icon: "Route" },
  { id: "completed", label: "Completadas", icon: "CheckCircle" },
  { id: "cancelled", label: "Canceladas", icon: "XCircle" },
  { id: "no_show", label: "No abordó", icon: "UserX" },
];
