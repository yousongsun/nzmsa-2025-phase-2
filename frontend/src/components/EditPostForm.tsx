import { Globe, ImageIcon, Lock, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type Post, PostPrivacy, type UpdatePostRequest } from "@/models/post";
import type { Trip } from "@/models/trip";
import { updatePost } from "@/services/PostService";
import { getTrips } from "@/services/TripService";

interface EditPostFormProps {
	post: Post;
	onPostUpdated: (post: Post) => void;
	onCancel: () => void;
}

export function EditPostForm({
	post,
	onPostUpdated,
	onCancel,
}: EditPostFormProps) {
	const [content, setContent] = useState(post.content);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(
		post.imageUrl
			? `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5042"}${post.imageUrl}`
			: null,
	);
	const [imageAltText, setImageAltText] = useState(post.imageAltText || "");
	const [privacy, setPrivacy] = useState<PostPrivacy>(post.privacy);
	const [selectedTripId, setSelectedTripId] = useState<number | undefined>(
		post.tripId || undefined,
	);
	const [removeImage, setRemoveImage] = useState(false);
	const [trips, setTrips] = useState<Trip[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const loadTrips = async () => {
			try {
				const userTrips = await getTrips();
				setTrips(userTrips);
			} catch (error) {
				console.error("Error loading trips:", error);
			}
		};
		loadTrips();
	}, []);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				// 5MB limit
				setError("Image size must be less than 5MB");
				return;
			}

			if (!file.type.startsWith("image/")) {
				setError("Please select a valid image file");
				return;
			}

			setSelectedFile(file);
			setRemoveImage(false);
			setError("");

			// Create preview
			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setSelectedFile(null);
		setImagePreview(null);
		setImageAltText("");
		setRemoveImage(true);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!content.trim()) {
			setError("Post content is required");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const updateData: UpdatePostRequest = {
				content: content.trim(),
				privacy,
				tripId: selectedTripId,
				removeImage,
			};

			if (selectedFile) {
				updateData.image = selectedFile;
				updateData.imageAltText = imageAltText;
			} else if (!removeImage && imageAltText !== post.imageAltText) {
				updateData.imageAltText = imageAltText;
			}

			await updatePost(post.postId, updateData);

			// Create updated post object for optimistic update
			const updatedPost: Post = {
				...post,
				content: content.trim(),
				privacy,
				tripId: selectedTripId,
				imageUrl: removeImage
					? undefined
					: selectedFile
						? imagePreview || undefined
						: post.imageUrl,
				imageAltText: removeImage ? undefined : imageAltText,
				updatedAt: new Date().toISOString(),
			};

			onPostUpdated(updatedPost);
		} catch (error) {
			console.error("Error updating post:", error);
			setError("Failed to update post. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const getPrivacyIcon = (privacyLevel: PostPrivacy) => {
		switch (privacyLevel) {
			case PostPrivacy.Public:
				return <Globe className="h-4 w-4" />;
			case PostPrivacy.FollowersOnly:
				return <Users className="h-4 w-4" />;
			case PostPrivacy.Private:
				return <Lock className="h-4 w-4" />;
			default:
				return <Globe className="h-4 w-4" />;
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && (
				<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
					{error}
				</div>
			)}

			{/* Content */}
			<div className="space-y-2">
				<Label htmlFor="content">Content</Label>
				<Textarea
					id="content"
					placeholder="Share your thoughts, experiences, or travel stories..."
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows={4}
					maxLength={2000}
					className="resize-none"
				/>
				<div className="text-xs text-muted-foreground text-right">
					{content.length}/2000 characters
				</div>
			</div>

			{/* Image Upload/Edit */}
			<div className="space-y-2">
				<Label>Image</Label>
				<div className="flex items-center space-x-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => fileInputRef.current?.click()}
						disabled={loading}
					>
						<ImageIcon className="h-4 w-4 mr-2" />
						{selectedFile
							? "Change Image"
							: imagePreview && !removeImage
								? "Replace Image"
								: "Add Image"}
					</Button>
					{imagePreview && !removeImage && (
						<Button
							type="button"
							variant="outline"
							onClick={handleRemoveImage}
							disabled={loading}
						>
							<X className="h-4 w-4 mr-2" />
							Remove Image
						</Button>
					)}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileSelect}
						className="hidden"
					/>
				</div>

				{imagePreview && !removeImage && (
					<div className="relative">
						<img
							src={imagePreview}
							alt="Preview"
							className="w-full h-48 object-cover rounded-lg border"
						/>
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onClick={handleRemoveImage}
							className="absolute top-2 right-2"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				)}

				{imagePreview && !removeImage && (
					<div className="space-y-2">
						<Label htmlFor="imageAltText">
							Image Description (for accessibility)
						</Label>
						<Input
							id="imageAltText"
							placeholder="Briefly describe the image..."
							value={imageAltText}
							onChange={(e) => setImageAltText(e.target.value)}
							maxLength={500}
						/>
					</div>
				)}
			</div>

			{/* Trip Association */}
			{trips.length > 0 && (
				<div className="space-y-2">
					<Label>Associate with Trip</Label>
					<Select
						value={selectedTripId?.toString() || ""}
						onValueChange={(value) =>
							setSelectedTripId(value ? parseInt(value) : undefined)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a trip..." />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">No trip association</SelectItem>
							{trips.map((trip) => (
								<SelectItem key={trip.tripId} value={trip.tripId.toString()}>
									{trip.name} - {trip.destination}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}

			{/* Privacy Settings */}
			<div className="space-y-2">
				<Label>Privacy</Label>
				<Select
					value={privacy.toString()}
					onValueChange={(value) => setPrivacy(parseInt(value) as PostPrivacy)}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={PostPrivacy.Public.toString()}>
							<div className="flex items-center space-x-2">
								<Globe className="h-4 w-4" />
								<span>Public - Anyone can see this post</span>
							</div>
						</SelectItem>
						<SelectItem value={PostPrivacy.FollowersOnly.toString()}>
							<div className="flex items-center space-x-2">
								<Users className="h-4 w-4" />
								<span>Followers Only - Only your followers can see this</span>
							</div>
						</SelectItem>
						<SelectItem value={PostPrivacy.Private.toString()}>
							<div className="flex items-center space-x-2">
								<Lock className="h-4 w-4" />
								<span>Private - Only you can see this post</span>
							</div>
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Form Actions */}
			<div className="flex justify-between items-center pt-4">
				<div className="flex items-center space-x-2 text-sm text-muted-foreground">
					{getPrivacyIcon(privacy)}
					<span>
						{privacy === PostPrivacy.Public && "Public"}
						{privacy === PostPrivacy.FollowersOnly && "Followers Only"}
						{privacy === PostPrivacy.Private && "Private"}
					</span>
				</div>

				<div className="flex space-x-2">
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={loading || !content.trim()}>
						{loading ? "Updating..." : "Update Post"}
					</Button>
				</div>
			</div>
		</form>
	);
}
