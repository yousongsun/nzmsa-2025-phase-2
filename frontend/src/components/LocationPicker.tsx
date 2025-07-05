import { MapPin, Search } from "lucide-react";
import React, { useCallback, useState } from "react";
import MapGL, {
	type MapRef,
	Marker,
	NavigationControl,
} from "react-map-gl/maplibre";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "maplibre-gl/dist/maplibre-gl.css";

interface LocationPickerProps {
	latitude?: number;
	longitude?: number;
	address?: string;
	onLocationChange: (location: {
		latitude: number;
		longitude: number;
		address?: string;
	}) => void;
	onAddressChange?: (address: string) => void;
	className?: string;
}

// Simple geocoding function using a public API (you might want to use a proper service)
const geocodeAddress = async (address: string) => {
	try {
		// Using Nominatim (OpenStreetMap) for free geocoding
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
		);
		const data = await response.json();

		if (data && data.length > 0) {
			return {
				latitude: parseFloat(data[0].lat),
				longitude: parseFloat(data[0].lon),
				displayName: data[0].display_name,
			};
		}
		return null;
	} catch (error) {
		console.error("Geocoding error:", error);
		return null;
	}
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
	latitude,
	longitude,
	address = "",
	onLocationChange,
	onAddressChange,
	className = "h-64 w-full rounded-lg",
}) => {
	const mapRef = React.useRef<MapRef>(null);
	const [searchAddress, setSearchAddress] = useState(address);
	const [isSearching, setIsSearching] = useState(false);
	const [currentLocation, setCurrentLocation] = useState({
		latitude: latitude || -36.8485, // Auckland, NZ default
		longitude: longitude || 174.7633,
	});

	const handleMapClick = useCallback(
		(event: any) => {
			const { lat, lng } = event.lngLat;
			const newLocation = { latitude: lat, longitude: lng };
			setCurrentLocation(newLocation);
			onLocationChange(newLocation);
		},
		[onLocationChange],
	);

	const handleSearch = async () => {
		if (!searchAddress.trim()) return;

		setIsSearching(true);
		try {
			const result = await geocodeAddress(searchAddress);
			if (result) {
				const newLocation = {
					latitude: result.latitude,
					longitude: result.longitude,
					address: result.displayName,
				};
				setCurrentLocation({
					latitude: result.latitude,
					longitude: result.longitude,
				});
				onLocationChange(newLocation);
				onAddressChange?.(result.displayName);

				// Fly to the new location
				mapRef.current?.flyTo({
					center: [result.longitude, result.latitude],
					zoom: 14,
				});
			} else {
				alert("Location not found. Please try a different address.");
			}
		} catch (error) {
			console.error("Search error:", error);
			alert("Error searching for location. Please try again.");
		} finally {
			setIsSearching(false);
		}
	};

	const handleGetCurrentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const newLocation = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					};
					setCurrentLocation(newLocation);
					onLocationChange(newLocation);

					mapRef.current?.flyTo({
						center: [newLocation.longitude, newLocation.latitude],
						zoom: 14,
					});
				},
				(error) => {
					console.error("Geolocation error:", error);
					alert(
						"Unable to get your current location. Please enter an address or click on the map.",
					);
				},
			);
		} else {
			alert("Geolocation is not supported by this browser.");
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<Label htmlFor="address-search">Search Address</Label>
				<div className="flex gap-2 mt-1">
					<Input
						id="address-search"
						value={searchAddress}
						onChange={(e) => setSearchAddress(e.target.value)}
						placeholder="Enter address to search..."
						onKeyDown={(e) => e.key === "Enter" && handleSearch()}
					/>
					<Button
						type="button"
						onClick={handleSearch}
						disabled={isSearching}
						className="whitespace-nowrap"
					>
						<Search className="w-4 h-4 mr-1" />
						{isSearching ? "Searching..." : "Search"}
					</Button>
				</div>
			</div>

			<div className="flex gap-2">
				<Button
					type="button"
					variant="outline"
					onClick={handleGetCurrentLocation}
					className="whitespace-nowrap"
				>
					<MapPin className="w-4 h-4 mr-1" />
					Use Current Location
				</Button>
				<div className="text-sm text-gray-600 flex items-center">
					Click on the map to select a location
				</div>
			</div>

			<div className={className}>
				<MapGL
					ref={mapRef}
					initialViewState={{
						latitude: currentLocation.latitude,
						longitude: currentLocation.longitude,
						zoom: 12,
					}}
					style={{ width: "100%", height: "100%" }}
					mapStyle="https://api.maptiler.com/maps/streets/style.json?key=taNvloJtTJkyv70js5mW"
					onClick={handleMapClick}
				>
					<NavigationControl position="top-right" />

					<Marker
						latitude={currentLocation.latitude}
						longitude={currentLocation.longitude}
						draggable
						onDragEnd={(event) => {
							const newLocation = {
								latitude: event.lngLat.lat,
								longitude: event.lngLat.lng,
							};
							setCurrentLocation(newLocation);
							onLocationChange(newLocation);
						}}
					>
						<div className="p-2 bg-red-600 rounded-full shadow-lg cursor-move">
							<MapPin className="w-4 h-4 text-white" />
						</div>
					</Marker>
				</MapGL>
			</div>

			{currentLocation.latitude && currentLocation.longitude && (
				<div className="text-xs text-gray-500">
					Selected: {currentLocation.latitude.toFixed(6)},{" "}
					{currentLocation.longitude.toFixed(6)}
				</div>
			)}
		</div>
	);
};
