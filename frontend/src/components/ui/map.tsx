import { Calendar, Hotel, MapPin, Plane } from "lucide-react";
import React, { useCallback, useRef } from "react";
import MapGL, {
	type MapRef,
	Marker,
	NavigationControl,
	Popup,
} from "react-map-gl/maplibre";
import type { ItineraryItem, ItineraryItemType } from "@/models/itinerary-item";
import type { Trip } from "@/models/trip";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapLocation {
	id: string;
	latitude: number;
	longitude: number;
	title: string;
	description?: string;
	type?: "trip" | ItineraryItemType;
	data?: Trip | ItineraryItem;
}

interface BaseMapProps {
	locations: MapLocation[];
	initialViewState?: {
		latitude: number;
		longitude: number;
		zoom: number;
	};
	onLocationClick?: (location: MapLocation) => void;
	selectedLocationId?: string;
	style?: React.CSSProperties;
	className?: string;
}

const getIconForType = (type?: string) => {
	switch (type) {
		case "Flight":
			return <Plane className="w-4 h-4 text-blue-600" />;
		case "Hotel":
			return <Hotel className="w-4 h-4 text-green-600" />;
		case "Activity":
			return <Calendar className="w-4 h-4 text-purple-600" />;
		case "trip":
			return <MapPin className="w-4 h-4 text-red-600" />;
		default:
			return <MapPin className="w-4 h-4 text-gray-600" />;
	}
};

const getMarkerColor = (type?: string) => {
	switch (type) {
		case "Flight":
			return "#2563eb";
		case "Hotel":
			return "#16a34a";
		case "Activity":
			return "#9333ea";
		case "trip":
			return "#dc2626";
		default:
			return "#6b7280";
	}
};

export const BaseMap: React.FC<BaseMapProps> = ({
	locations,
	initialViewState = {
		latitude: -36.8485,
		longitude: 174.7633, // Auckland, NZ as default
		zoom: 10,
	},
	onLocationClick,
	selectedLocationId,
	style,
	className = "h-96 w-full rounded-lg",
}) => {
	const mapRef = useRef<MapRef>(null);
	const [selectedLocation, setSelectedLocation] =
		React.useState<MapLocation | null>(null);

	const handleMarkerClick = useCallback(
		(location: MapLocation) => {
			setSelectedLocation(location);
			onLocationClick?.(location);
		},
		[onLocationClick],
	);

	const fitBounds = useCallback(() => {
		if (!mapRef.current || locations.length === 0) return;

		if (locations.length === 1) {
			mapRef.current.flyTo({
				center: [locations[0].longitude, locations[0].latitude],
				zoom: 12,
			});
			return;
		}

		const bounds = locations.reduce(
			(acc, location) => ({
				minLat: Math.min(acc.minLat, location.latitude),
				maxLat: Math.max(acc.maxLat, location.latitude),
				minLng: Math.min(acc.minLng, location.longitude),
				maxLng: Math.max(acc.maxLng, location.longitude),
			}),
			{
				minLat: locations[0].latitude,
				maxLat: locations[0].latitude,
				minLng: locations[0].longitude,
				maxLng: locations[0].longitude,
			},
		);

		mapRef.current.fitBounds(
			[
				[bounds.minLng, bounds.minLat],
				[bounds.maxLng, bounds.maxLat],
			],
			{ padding: 40, maxZoom: 15 },
		);
	}, [locations]);

	React.useEffect(() => {
		const timer = setTimeout(fitBounds, 100);
		return () => clearTimeout(timer);
	}, [fitBounds]);

	return (
		<div className={className} style={style}>
			<MapGL
				ref={mapRef}
				initialViewState={initialViewState}
				style={{ width: "100%", height: "100%" }}
				mapStyle="https://api.maptiler.com/maps/streets/style.json?key=taNvloJtTJkyv70js5mW"
				onClick={() => setSelectedLocation(null)}
			>
				<NavigationControl position="top-right" />

				{locations.map((location) => (
					<Marker
						key={location.id}
						latitude={location.latitude}
						longitude={location.longitude}
						onClick={(e) => {
							e.originalEvent.stopPropagation();
							handleMarkerClick(location);
						}}
					>
						<div
							className={`p-2 rounded-full shadow-lg cursor-pointer transition-all hover:scale-110 ${
								selectedLocationId === location.id ? "ring-2 ring-blue-500" : ""
							}`}
							style={{ backgroundColor: getMarkerColor(location.type) }}
						>
							{getIconForType(location.type)}
						</div>
					</Marker>
				))}

				{selectedLocation && (
					<Popup
						latitude={selectedLocation.latitude}
						longitude={selectedLocation.longitude}
						anchor="bottom"
						onClose={() => setSelectedLocation(null)}
						closeButton={true}
						closeOnClick={false}
					>
						<div className="p-2">
							<h3 className="font-semibold text-sm">
								{selectedLocation.title}
							</h3>
							{selectedLocation.description && (
								<p className="text-xs text-gray-600 mt-1">
									{selectedLocation.description}
								</p>
							)}
							{selectedLocation.type && selectedLocation.type !== "trip" && (
								<div className="flex items-center mt-2 text-xs">
									{getIconForType(selectedLocation.type)}
									<span className="ml-1 capitalize">
										{selectedLocation.type}
									</span>
								</div>
							)}
						</div>
					</Popup>
				)}
			</MapGL>
		</div>
	);
};
