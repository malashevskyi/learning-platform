import type { Meta, StoryObj } from "@storybook/react";
import FullScreenLoader from "./index";

const meta: Meta<typeof FullScreenLoader> = {
  title: "UI/FullScreenLoader",
  component: FullScreenLoader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FullScreenLoader />,
};
