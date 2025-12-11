import type { Meta, StoryObj } from "@storybook/react";
import { LanguageSelector } from ".";

const meta = {
  title: "Features/LanguageSelector",
  component: LanguageSelector,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LanguageSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-[150px] items-center justify-center">
      <LanguageSelector />
    </div>
  ),
};
