'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

export default function PropertyMap({ latitude, longitude, address }: PropertyMapProps) {
  useEffect(() => {
    // Check if container already initialized
    const container = L.DomUtil.get('map-container');
    if (container) {
      (container as any)._leaflet_id = null;
    }

    const map = L.map('map-container').setView([latitude, longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(address)
      .openPopup();

    return () => {
      map.remove();
    };
  }, [latitude, longitude, address]);

  return (
    <div 
      id="map-container" 
      className="w-full h-80 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 z-10" 
    />
  );
}
