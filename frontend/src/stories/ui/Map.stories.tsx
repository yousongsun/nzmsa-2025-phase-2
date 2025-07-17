import type { Meta, StoryObj } from "@storybook/react";
import { BaseMap } from "@/components/ui/map";

const mockLocations = [
	{
		id: "1",
		latitude: -36.8485,
		longitude: 174.7633,
		title: "Auckland",
		description: "Beautiful city in New Zealand",
		type: "trip" as const,
	},
	{
		id: "2",
		latitude: -41.2924,
		longitude: 174.7787,
		title: "Wellington",
		description: "Capital city of New Zealand",
		type: "accommodation" as const,
	},
];

const meta = {
	title: "UI/Map",
	component: BaseMap,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<div style={{ width: "100vw", height: "100vh" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof BaseMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		locations: mockLocations,
		initialViewState: {
			latitude: -36.8485,
			longitude: 174.7633,
			zoom: 6,
		},
	},
};

export const SingleLocation: Story = {
	args: {
		locations: [mockLocations[0]],
		initialViewState: {
			latitude: -36.8485,
			longitude: 174.7633,
			zoom: 10,
		},
	},
};

export const EmptyMap: Story = {
	args: {
		locations: [],
		initialViewState: {
			latitude: 0,
			longitude: 0,
			zoom: 2,
		},
	},
};
