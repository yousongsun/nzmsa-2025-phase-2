import { Calendar, Hotel, MapPin, Plane } from "lucide-react";
import React, { useCallback, useRef } from "react";
import MapGL, {
	Layer,
	type MapRef,
	Marker,
	NavigationControl,
	Popup,
	Source,
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
	startTime?: string;
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
	showRouteLines?: boolean;
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

const createRouteLineGeoJSON = (locations: MapLocation[]) => {
	// Filter locations with coordinates and sort by start time
	const sortedLocations = locations
		.filter((loc) => loc.latitude && loc.longitude && loc.startTime)
		.sort((a, b) => {
			const timeA = new Date(a.startTime!).getTime();
			const timeB = new Date(b.startTime!).getTime();
			return timeA - timeB;
		});

	if (sortedLocations.length < 2) {
		return null;
	}

	const coordinates = sortedLocations.map((loc) => [
		loc.longitude,
		loc.latitude,
	]);

	return {
		type: "Feature" as const,
		properties: {},
		geometry: {
			type: "LineString" as const,
			coordinates: coordinates,
		},
	};
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
	showRouteLines = false,
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

	const routeGeoJSON = React.useMemo(() => {
		if (!showRouteLines) return null;
		return createRouteLineGeoJSON(locations);
	}, [locations, showRouteLines]);

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

				{/* Route line */}
				{showRouteLines && routeGeoJSON && (
					<Source id="route" type="geojson" data={routeGeoJSON}>
						<Layer
							id="route-line"
							type="line"
							paint={{
								"line-color": "#3b82f6",
								"line-width": 3,
								"line-opacity": 0.8,
							}}
							layout={{
								"line-join": "round",
								"line-cap": "round",
							}}
						/>
						<Layer
							id="route-line-outline"
							type="line"
							paint={{
								"line-color": "#1e40af",
								"line-width": 5,
								"line-opacity": 0.4,
							}}
							layout={{
								"line-join": "round",
								"line-cap": "round",
							}}
						/>
					</Source>
				)}

				{locations.map((location, _index) => (
					<Marker
						key={location.id}
						latitude={location.latitude}
						longitude={location.longitude}
						onClick={(e) => {
							e.originalEvent.stopPropagation();
							handleMarkerClick(location);
						}}
					>
						<div className="relative">
							<div
								className={`p-2 rounded-full shadow-lg cursor-pointer transition-all hover:scale-110 ${
									selectedLocationId === location.id
										? "ring-2 ring-blue-500"
										: ""
								}`}
								style={{ backgroundColor: getMarkerColor(location.type) }}
							>
								{getIconForType(location.type)}
							</div>
							{/* Show sequence number if showing route lines */}
							{showRouteLines && location.startTime && (
								<div className="absolute -top-2 -right-2 bg-white text-xs font-bold text-gray-800 rounded-full w-5 h-5 flex items-center justify-center border border-gray-300 shadow-sm">
									{locations
										.filter((loc) => loc.startTime)
										.sort(
											(a, b) =>
												new Date(a.startTime!).getTime() -
												new Date(b.startTime!).getTime(),
										)
										.findIndex((loc) => loc.id === location.id) + 1}
								</div>
							)}
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
							{selectedLocation.startTime && (
								<p className="text-xs text-gray-500 mt-1">
									{new Date(selectedLocation.startTime).toLocaleString()}
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
