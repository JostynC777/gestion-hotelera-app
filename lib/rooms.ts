export type Room = {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
};

export const rooms: Room[] = [
  {
    id: "suite-marina",
    name: "Suite Marina",
    type: "Suite",
    price: 180,
    description: "Una suite luminosa con terraza y vistas al mar.",
  },
  {
    id: "doble-jardin",
    name: "Doble Jardín",
    type: "Habitación doble",
    price: 120,
    description: "Una estancia tranquila junto a los jardines del hotel.",
  },
  {
    id: "premium-ciudad",
    name: "Premium Ciudad",
    type: "Habitación premium",
    price: 145,
    description: "Confort moderno en el corazón de la ciudad.",
  },
];

export function getRoom(id: string) {
  return rooms.find((room) => room.id === id);
}