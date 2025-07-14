import { ImageIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type CreatePostRequest, PostPrivacy } from "@/models/post";
import { createPost } from "@/services/PostService";

interface CreatePostFormProps {
	onPostCreated?: (success: boolean) => void;
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
	const [content, setContent] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageAltText, setImageAltText] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const fileInputRef = useRef<HTMLInputElement>(null);

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
			const postData: CreatePostRequest = {
				content: content.trim(),
				privacy: PostPrivacy.Public,
			};

			if (selectedFile) {
				postData.image = selectedFile;
				postData.imageAltText = imageAltText;
			}

			await createPost(postData);

			// Reset form
			setContent("");
			setSelectedFile(null);
			setImagePreview(null);
			setImageAltText("");
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}

			if (onPostCreated) {
				onPostCreated(true);
			}
		} catch (error) {
			console.error("Error creating post:", error);
			setError("Failed to create post. Please try again.");
			if (onPostCreated) {
				onPostCreated(false);
			}
		} finally {
			setLoading(false);
		}
	};

	const clearForm = () => {
		setContent("");
		setSelectedFile(null);
		setImagePreview(null);
		setImageAltText("");
		setError("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Create New Post</CardTitle>
			</CardHeader>

			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4">
					{error && (
						<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
							{error}
						</div>
					)}

					{/* Content */}
					<div className="space-y-2">
						<Label htmlFor="content">What's on your mind?</Label>
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

					{/* Image Upload */}
					<div className="space-y-2">
						<Label>Add Image</Label>
						<div className="flex items-center space-x-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => fileInputRef.current?.click()}
								disabled={loading}
							>
								<ImageIcon className="h-4 w-4 mr-2" />
								{selectedFile ? "Change Image" : "Add Image"}
							</Button>
							{imagePreview && (
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

						{imagePreview && (
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

						{imagePreview && (
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
				</CardContent>

				<CardFooter className="flex justify-between">
					<div className="text-sm text-muted-foreground">
						Public post - everyone can see this
					</div>

					<div className="flex space-x-2">
						<Button
							type="button"
							variant="outline"
							onClick={clearForm}
							disabled={loading}
						>
							Clear
						</Button>
						<Button type="submit" disabled={loading || !content.trim()}>
							{loading ? "Posting..." : "Create Post"}
						</Button>
					</div>
				</CardFooter>
			</form>
		</Card>
	);
}
