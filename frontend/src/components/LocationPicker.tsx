import { MapPin, Search, X } from "lucide-react";
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

interface SearchResult {
	latitude: number;
	longitude: number;
	displayName: string;
	boundingBox?: number[];
}

// Simple geocoding function using a public API (you might want to use a proper service)
const geocodeAddress = async (
	address: string,
	limit = 5,
): Promise<SearchResult[]> => {
	try {
		// Using Nominatim (OpenStreetMap) for free geocoding
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=${limit}&addressdetails=1`,
		);
		const data = await response.json();

		if (data && data.length > 0) {
			return data.map((item: any) => ({
				latitude: parseFloat(item.lat),
				longitude: parseFloat(item.lon),
				displayName: item.display_name,
				boundingBox: item.boundingbox
					? item.boundingbox.map(parseFloat)
					: undefined,
			}));
		}
		return [];
	} catch (error) {
		console.error("Geocoding error:", error);
		return [];
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
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [showResults, setShowResults] = useState(false);
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
			setShowResults(false);
		},
		[onLocationChange],
	);

	const handleSearch = async () => {
		if (!searchAddress.trim()) return;

		setIsSearching(true);
		setShowResults(false);
		try {
			const results = await geocodeAddress(searchAddress);
			if (results.length > 0) {
				setSearchResults(results);
				setShowResults(true);
			} else {
				alert("No locations found. Please try a different address.");
				setSearchResults([]);
			}
		} catch (error) {
			console.error("Search error:", error);
			alert("Error searching for location. Please try again.");
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	const handleResultSelect = (result: SearchResult) => {
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
		setSearchAddress(result.displayName);
		setShowResults(false);

		// Fly to the new location
		mapRef.current?.flyTo({
			center: [result.longitude, result.latitude],
			zoom: 14,
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		// Prevent form submission when Enter is pressed during search
		if (e.key === "Enter") {
			e.preventDefault();
			e.stopPropagation();
			handleSearch();
		}
		if (e.key === "Escape") {
			setShowResults(false);
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
					setShowResults(false);

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
			<div className="relative">
				<Label htmlFor="address-search">Search Address</Label>
				<div className="flex gap-2 mt-1">
					<div className="relative flex-1">
						<Input
							id="address-search"
							value={searchAddress}
							onChange={(e) => setSearchAddress(e.target.value)}
							placeholder="Enter address to search..."
							onKeyDown={handleKeyDown}
							onFocus={() => searchResults.length > 0 && setShowResults(true)}
						/>
						{showResults && searchResults.length > 0 && (
							<div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
								<div className="flex justify-between items-center p-2 border-b bg-gray-50">
									<span className="text-sm font-medium text-gray-700">
										Search Results ({searchResults.length})
									</span>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setShowResults(false)}
										className="h-6 w-6 p-0"
									>
										<X className="w-4 h-4" />
									</Button>
								</div>
								{searchResults.map((result) => (
									<button
										key={`${result.latitude}-${result.longitude}`}
										type="button"
										className="w-full text-left p-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
										onClick={() => handleResultSelect(result)}
									>
										<div className="text-sm font-medium text-gray-900 truncate">
											{result.displayName.split(",")[0]}
										</div>
										<div className="text-xs text-gray-500 mt-1 line-clamp-2">
											{result.displayName}
										</div>
									</button>
								))}
							</div>
						)}
					</div>
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
							setShowResults(false);
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
