import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type LatLng = { lat: number; lng: number };

type Props = {
  value?: LatLng | null;
  onChange: (pos: LatLng, address?: string) => void;
};

function ClickHandler({
  onChange,
}: {
  onChange: (p: LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function Recenter({ pos }: { pos: LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([pos.lat, pos.lng], map.getZoom());
  }, [pos.lat, pos.lng, map]);
  return null;
}

async function reverseGeocode(lat: number, lng: number): Promise<string | undefined> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`,
    );
    const data = await r.json();
    return data.display_name as string | undefined;
  } catch {
    return undefined;
  }
}

export default function MapPicker({ value, onChange }: Props) {
  const [pos, setPos] = useState<LatLng>(value || { lat: 55.7558, lng: 37.6176 });

  useEffect(() => {
    if (value) setPos(value);
  }, [value]);

  const center: [number, number] = useMemo(() => [pos.lat, pos.lng], [pos.lat, pos.lng]);

  const setAndEmit = async (p: LatLng) => {
    setPos(p);
    const address = await reverseGeocode(p.lat, p.lng);
    onChange(p, address);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (g) => setAndEmit({ lat: g.coords.latitude, lng: g.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase font-semibold tracking-wider text-brand-200">
          Точка доставки на карте
        </p>
        <button type="button" onClick={useMyLocation} className="text-xs text-accent-600 font-medium hover:underline">
          Моё местоположение
        </button>
      </div>
      <MapContainer center={center} zoom={12} className="w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        <Marker position={center} icon={icon} />
        <ClickHandler onChange={setAndEmit} />
        <Recenter pos={pos} />
      </MapContainer>
      <p className="text-xs text-brand-200">
        Нажмите на карту, чтобы выбрать адрес доставки. Координаты: {pos.lat.toFixed(4)},{' '}
        {pos.lng.toFixed(4)}
      </p>
    </div>
  );
}
