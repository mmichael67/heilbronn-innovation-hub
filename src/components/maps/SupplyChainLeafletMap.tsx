import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { RotateCcw, Maximize2, Minimize2, Eye } from "lucide-react";

type NodeType = "supplier" | "warehouse" | "factory" | "distribution" | "customer";

type SupplyNode = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: NodeType;
  inventory: number;
};

type SupplyFlow = {
  from: string;
  to: string;
  volume: number;
  status: "active" | "delayed" | "blocked";
};

const nodeColors: Record<NodeType, string> = {
  supplier: "#22c55e",
  warehouse: "#3b82f6",
  factory: "#f97316",
  distribution: "#8b5cf6",
  customer: "#ec4899",
};

const nodeIcons: Record<NodeType, string> = {
  supplier: "📦",
  warehouse: "🏭",
  factory: "⚙️",
  distribution: "🚛",
  customer: "🏪",
};

function createNodeIcon(type: NodeType, isHighlighted: boolean) {
  const color = nodeColors[type];
  const icon = nodeIcons[type];
  const size = isHighlighted ? 48 : 40;
  
  return L.divIcon({
    className: "supply-node-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        border-radius: 12px;
        border: 3px solid rgba(255,255,255,0.95);
        box-shadow: 0 6px 20px ${color}50, 0 0 ${isHighlighted ? '30' : '15'}px ${color}${isHighlighted ? '80' : '40'};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.45}px;
        transition: all 0.3s ease;
        ${isHighlighted ? 'animation: nodePulse 1.5s ease-in-out infinite;' : ''}
      ">${icon}</div>
      ${isHighlighted ? `
        <style>
          @keyframes nodePulse {
            0%, 100% { transform: scale(1); box-shadow: 0 6px 20px ${color}50, 0 0 30px ${color}80; }
            50% { transform: scale(1.15); box-shadow: 0 8px 25px ${color}70, 0 0 40px ${color}aa; }
          }
        </style>
      ` : ''}
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createVehicleIcon(color: string) {
  return L.divIcon({
    className: "vehicle-marker",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 14px rgba(0,0,0,0.5), 0 0 10px ${color}60;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      ">🚚</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function getFlowColor(status: SupplyFlow["status"]) {
  switch (status) {
    case "active": return "#22c55e";
    case "delayed": return "#f59e0b";
    case "blocked": return "#ef4444";
    default: return "#64748b";
  }
}

export function SupplyChainLeafletMap({
  center,
  zoom,
  className,
  nodes,
  flows,
  isSimulating,
  currentStepNodeId,
  onSelectNode,
}: {
  center: [number, number];
  zoom: number;
  className?: string;
  nodes: SupplyNode[];
  flows: SupplyFlow[];
  isSimulating: boolean;
  currentStepNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    nodes?: L.LayerGroup;
    flows?: L.LayerGroup;
    vehicles?: L.LayerGroup;
  }>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const vehiclePositions = useRef<Map<string, { position: number; marker: L.Marker; from: [number, number]; to: [number, number] }>>(new Map());
  const animationFrameRef = useRef<number>();
  const onSelectNodeRef = useRef(onSelectNode);

  useEffect(() => {
    onSelectNodeRef.current = onSelectNode;
  }, [onSelectNode]);

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

    layersRef.current.flows = L.layerGroup().addTo(map);
    layersRef.current.vehicles = L.layerGroup().addTo(map);
    layersRef.current.nodes = L.layerGroup().addTo(map);

    setTimeout(() => map.invalidateSize(), 50);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  // Draw flows between nodes
  useEffect(() => {
    const flowsLayer = layersRef.current.flows;
    if (!mapRef.current || !flowsLayer) return;
    
    flowsLayer.clearLayers();

    for (const flow of flows) {
      const fromNode = nodes.find((n) => n.id === flow.from);
      const toNode = nodes.find((n) => n.id === flow.to);
      if (!fromNode || !toNode) continue;

      const color = getFlowColor(flow.status);
      const coords: L.LatLngExpression[] = [
        [fromNode.lat, fromNode.lng],
        [toNode.lat, toNode.lng],
      ];

      // Glow effect
      const glow = L.polyline(coords, {
        color: color,
        weight: 10,
        opacity: 0.2,
        lineCap: 'round',
      });
      glow.addTo(flowsLayer);

      // Main flow line
      const line = L.polyline(coords, {
        color: color,
        weight: 4,
        opacity: 0.8,
        dashArray: flow.status === "active" ? undefined : "10 6",
        lineCap: 'round',
      });

      line.bindPopup(`
        <div style="font-size:13px; min-width:180px; padding: 4px;">
          <div style="font-weight:700; margin-bottom:8px; color: ${color};">Materialfluss</div>
          <div style="display:flex; gap:8px; margin-bottom:4px;">
            <span style="color:#64748b;">Von:</span>
            <span style="font-weight:500;">${fromNode.name.split(' ')[0]}</span>
          </div>
          <div style="display:flex; gap:8px; margin-bottom:4px;">
            <span style="color:#64748b;">Nach:</span>
            <span style="font-weight:500;">${toNode.name.split(' ')[0]}</span>
          </div>
          <div style="display:flex; gap:8px; margin-bottom:4px;">
            <span style="color:#64748b;">Volumen:</span>
            <span style="font-weight:500;">${flow.volume} Einheiten</span>
          </div>
          <div style="display:flex; gap:8px;">
            <span style="color:#64748b;">Status:</span>
            <span style="font-weight:500; text-transform:capitalize; color: ${color};">${flow.status === 'active' ? 'Aktiv' : flow.status === 'delayed' ? 'Verzögert' : 'Blockiert'}</span>
          </div>
        </div>
      `, { className: 'custom-popup' });
      
      line.addTo(flowsLayer);
    }
  }, [nodes, flows]);

  // Animate vehicles along flows
  useEffect(() => {
    const vehiclesLayer = layersRef.current.vehicles;
    if (!mapRef.current || !vehiclesLayer) return;

    vehiclesLayer.clearLayers();
    vehiclePositions.current.clear();

    if (!isSimulating) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    // Initialize vehicle positions for each active flow
    flows.filter(f => f.status === 'active').forEach((flow, i) => {
      const fromNode = nodes.find(n => n.id === flow.from);
      const toNode = nodes.find(n => n.id === flow.to);
      if (!fromNode || !toNode) return;

      const marker = L.marker([fromNode.lat, fromNode.lng], {
        icon: createVehicleIcon(getFlowColor(flow.status)),
        zIndexOffset: 1000,
      }).addTo(vehiclesLayer);

      vehiclePositions.current.set(`${flow.from}-${flow.to}`, {
        position: Math.random(), // Start at random position
        marker,
        from: [fromNode.lat, fromNode.lng],
        to: [toNode.lat, toNode.lng],
      });
    });

    // Animation loop
    let lastTime = 0;
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      vehiclePositions.current.forEach((vehicleData) => {
        vehicleData.position += delta * 0.0002; // Speed factor
        if (vehicleData.position >= 1) {
          vehicleData.position = 0;
        }

        const t = vehicleData.position;
        const lat = vehicleData.from[0] + (vehicleData.to[0] - vehicleData.from[0]) * t;
        const lng = vehicleData.from[1] + (vehicleData.to[1] - vehicleData.from[1]) * t;

        vehicleData.marker.setLatLng([lat, lng]);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSimulating, flows, nodes]);

  // Draw node markers
  useEffect(() => {
    const nodesLayer = layersRef.current.nodes;
    if (!mapRef.current || !nodesLayer) return;
    nodesLayer.clearLayers();

    for (const node of nodes) {
      const isHighlighted = currentStepNodeId === node.id;
      const icon = createNodeIcon(node.type, isHighlighted);

      const marker = L.marker([node.lat, node.lng], { icon, zIndexOffset: isHighlighted ? 1000 : 0 });
      
      const inventoryColor = node.inventory > 80 ? '#22c55e' : node.inventory > 50 ? '#f59e0b' : '#ef4444';
      
      marker.bindPopup(`
        <div style="font-size:13px; min-width:200px; padding: 4px;">
          <div style="font-weight:700; margin-bottom:8px; color: ${nodeColors[node.type]};">${node.name}</div>
          <div style="display:flex; gap:8px; margin-bottom:4px;">
            <span style="color:#64748b;">Typ:</span>
            <span style="font-weight:500; text-transform:capitalize;">${node.type === 'supplier' ? 'Lieferant' : node.type === 'warehouse' ? 'Lager' : node.type === 'factory' ? 'Fabrik' : node.type === 'distribution' ? 'Vertrieb' : 'Kunde'}</span>
          </div>
          ${node.type !== 'customer' ? `
            <div style="margin-top:8px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span style="color:#64748b;">Bestandsniveau</span>
                <span style="font-weight:600; color: ${inventoryColor};">${node.inventory}%</span>
              </div>
              <div style="background:#1e293b; border-radius:4px; height:8px; overflow:hidden;">
                <div style="background: linear-gradient(90deg, ${inventoryColor}, ${inventoryColor}dd); height:100%; width:${node.inventory}%; border-radius:4px;"></div>
              </div>
            </div>
          ` : ''}
        </div>
      `, { className: 'custom-popup' });

      marker.on('click', () => {
        onSelectNodeRef.current?.(node.id);
      });

      marker.addTo(nodesLayer);
    }
  }, [nodes, currentStepNodeId]);

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
          <span className="font-medium text-sm">Lieferketten-Netzwerk</span>
          <span className="text-xs text-muted-foreground">• Echtzeit-Materialfluss</span>
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
