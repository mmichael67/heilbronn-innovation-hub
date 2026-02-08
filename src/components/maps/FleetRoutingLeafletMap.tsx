import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { RotateCcw, Maximize2, Minimize2, Eye } from "lucide-react";

type LocationType = "warehouse" | "customer";

type DeliveryLocation = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: LocationType;
  demand?: number;
};

type RouteType = {
  id: string;
  vehicle: string;
  color: string;
  stops: number[];
  distance: number;
  time: string;
  status: "active" | "pending" | "completed";
  load: number;
};

const OSRM_API = "https://router.project-osrm.org/route/v1/driving";

function createMarkerIcon(type: LocationType, isHighlighted: boolean, index?: number) {
  const isWarehouse = type === "warehouse";
  const color = isWarehouse ? "#3b82f6" : "#22c55e";
  const size = isHighlighted ? 44 : 36;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        border-radius: ${isWarehouse ? '8px' : '50%'};
        border: 3px solid rgba(255,255,255,0.95);
        box-shadow: 0 4px 12px ${color}60, 0 0 ${isHighlighted ? '20' : '10'}px ${color}40;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.45}px;
        color: white;
        font-weight: bold;
        transition: all 0.3s ease;
      ">${isWarehouse ? '🏭' : (index ?? '')}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createTruckIcon(color: string) {
  return L.divIcon({
    className: "truck-marker",
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 14px rgba(0,0,0,0.5), 0 0 10px ${color}60;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      ">🚛</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

async function fetchRealRoute(from: [number, number], to: [number, number]): Promise<[number, number][] | null> {
  try {
    const url = `${OSRM_API}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes[0]) {
      return data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch route:", error);
    return null;
  }
}

export function FleetRoutingLeafletMap({
  center,
  zoom,
  className,
  locations,
  routes,
  selectedRoute,
  onToggleRoute,
  isAnimating,
}: {
  center: [number, number];
  zoom: number;
  className?: string;
  locations: DeliveryLocation[];
  routes: RouteType[];
  selectedRoute: string | null;
  onToggleRoute?: (routeId: string) => void;
  isAnimating: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    markers?: L.LayerGroup;
    routes?: L.LayerGroup;
    trucks?: L.LayerGroup;
  }>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [routeCache, setRouteCache] = useState<Map<string, [number, number][]>>(new Map());
  const truckPositions = useRef<Map<string, { position: number; marker: L.Marker; route: [number, number][] }>>(new Map());
  const animationFrameRef = useRef<number>();

  const handleFullscreen = useCallback(() => {
    if (!wrapperRef.current) return;
    
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
        setTimeout(() => mapRef.current?.invalidateSize(), 100);
      }).catch(console.error);
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
        setTimeout(() => mapRef.current?.invalidateSize(), 100);
      });
    }
  }, []);

  const handleResetView = useCallback(() => {
    mapRef.current?.setView(center, zoom);
  }, [center, zoom]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    });
    mapRef.current = map;
    map.setView(center, zoom);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    layersRef.current.routes = L.layerGroup().addTo(map);
    layersRef.current.trucks = L.layerGroup().addTo(map);
    layersRef.current.markers = L.layerGroup().addTo(map);

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  // Fetch real routes from OSRM
  useEffect(() => {
    const fetchRoutes = async () => {
      const newCache = new Map<string, [number, number][]>();
      
      for (const route of routes) {
        const routeKey = route.id;
        const fullRoute: [number, number][] = [];
        
        for (let i = 0; i < route.stops.length - 1; i++) {
          const fromLoc = locations.find(l => l.id === route.stops[i]);
          const toLoc = locations.find(l => l.id === route.stops[i + 1]);
          
          if (fromLoc && toLoc) {
            const segmentRoute = await fetchRealRoute(
              [fromLoc.lat, fromLoc.lng],
              [toLoc.lat, toLoc.lng]
            );
            if (segmentRoute) {
              fullRoute.push(...segmentRoute);
            }
          }
        }
        
        if (fullRoute.length > 0) {
          newCache.set(routeKey, fullRoute);
        }
      }
      
      setRouteCache(newCache);
    };

    fetchRoutes();
  }, [routes, locations]);

  // Draw routes
  useEffect(() => {
    const routesLayer = layersRef.current.routes;
    if (!mapRef.current || !routesLayer) return;
    
    routesLayer.clearLayers();

    routes.forEach(route => {
      const routeCoords = routeCache.get(route.id);
      if (!routeCoords || routeCoords.length === 0) return;

      const isSelected = selectedRoute === route.id;
      
      // Glow effect
      const glow = L.polyline(routeCoords, {
        color: route.color,
        weight: isSelected ? 12 : 8,
        opacity: 0.2,
        lineCap: 'round',
      });
      glow.addTo(routesLayer);

      // Main route line
      const line = L.polyline(routeCoords, {
        color: route.color,
        weight: isSelected ? 5 : 3,
        opacity: isSelected ? 1 : 0.7,
        lineCap: 'round',
      });

      line.bindPopup(`
        <div style="font-size:13px; min-width:180px; padding: 4px;">
          <div style="font-weight:700; margin-bottom:8px; color: ${route.color};">${route.id}</div>
          <div style="display:flex; gap:8px; margin-bottom:4px;">
            <span style="color:#64748b;">Fahrzeug:</span>
            <span style="font-weight:500;">${route.vehicle}</span>
          </div>
          <div style="display:flex; gap:8px; margin-bottom:4px;">
            <span style="color:#64748b;">Distanz:</span>
            <span style="font-weight:500;">${route.distance} km</span>
          </div>
          <div style="display:flex; gap:8px;">
            <span style="color:#64748b;">Zeit:</span>
            <span style="font-weight:500;">${route.time}</span>
          </div>
        </div>
      `);

      line.on('click', () => onToggleRoute?.(route.id));
      line.addTo(routesLayer);
    });
  }, [routes, routeCache, selectedRoute, onToggleRoute]);

  // Animate trucks along routes
  useEffect(() => {
    const trucksLayer = layersRef.current.trucks;
    if (!mapRef.current || !trucksLayer) return;

    trucksLayer.clearLayers();
    truckPositions.current.clear();

    if (!isAnimating) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    // Initialize truck positions
    routes.forEach(route => {
      const routeCoords = routeCache.get(route.id);
      if (!routeCoords || routeCoords.length < 2) return;

      const marker = L.marker(routeCoords[0], {
        icon: createTruckIcon(route.color),
        zIndexOffset: 1000,
      }).addTo(trucksLayer);

      truckPositions.current.set(route.id, {
        position: Math.random() * routeCoords.length * 0.3,
        marker,
        route: routeCoords,
      });
    });

    // Animation loop
    let lastTime = 0;
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      truckPositions.current.forEach((truckData, routeId) => {
        const route = routes.find(r => r.id === routeId);
        if (!route) return;

        truckData.position += delta * 0.003;
        if (truckData.position >= truckData.route.length - 1) {
          truckData.position = 0;
        }

        const idx = Math.floor(truckData.position);
        const nextIdx = Math.min(idx + 1, truckData.route.length - 1);
        const t = truckData.position - idx;

        const lat = truckData.route[idx][0] + (truckData.route[nextIdx][0] - truckData.route[idx][0]) * t;
        const lng = truckData.route[idx][1] + (truckData.route[nextIdx][1] - truckData.route[idx][1]) * t;

        truckData.marker.setLatLng([lat, lng]);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, routes, routeCache]);

  // Draw location markers
  useEffect(() => {
    const markersLayer = layersRef.current.markers;
    if (!mapRef.current || !markersLayer) return;
    markersLayer.clearLayers();

    let customerIndex = 1;
    locations.forEach(location => {
      const idx = location.type === 'customer' ? customerIndex++ : undefined;
      const isHighlighted = selectedRoute ? routes.find(r => r.id === selectedRoute)?.stops.includes(location.id) : false;
      
      const marker = L.marker([location.lat, location.lng], {
        icon: createMarkerIcon(location.type, isHighlighted || false, idx),
        zIndexOffset: location.type === 'warehouse' ? 500 : 100,
      });

      marker.bindPopup(`
        <div style="font-size:13px; min-width:180px; padding: 4px;">
          <div style="font-weight:700; margin-bottom:8px; color: ${location.type === 'warehouse' ? '#3b82f6' : '#22c55e'};">
            ${location.name}
          </div>
          <div style="display:flex; gap:8px; margin-bottom:4px;">
            <span style="color:#64748b;">Typ:</span>
            <span style="font-weight:500; text-transform:capitalize;">${location.type === 'warehouse' ? 'Lager' : 'Kunde'}</span>
          </div>
          ${location.demand ? `
            <div style="display:flex; gap:8px;">
              <span style="color:#64748b;">Nachfrage:</span>
              <span style="font-weight:500;">${location.demand} Einheiten</span>
            </div>
          ` : ''}
        </div>
      `);

      marker.addTo(markersLayer);
    });
  }, [locations, routes, selectedRoute]);

  return (
    <div 
      ref={wrapperRef}
      className={`relative rounded-xl border-2 border-border overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      style={{ height: isFullscreen ? '100vh' : '100%' }}
    >
      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between px-4 py-3 bg-card/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">Live-Routenkarte</span>
          <span className="text-xs text-muted-foreground">• OSRM Straßenführung</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Ansicht zurücksetzen" onClick={handleResetView}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Vollbild" onClick={handleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Map container */}
      <div 
        ref={containerRef}
        className={`w-full ${className || ''}`}
        style={{ height: isFullscreen ? 'calc(100vh - 52px)' : 'calc(100% - 52px)', marginTop: '52px' }}
      />
    </div>
  );
}
