import type { Meta, StoryObj } from "@storybook/react";
import { InlineError } from ".";

const meta = {
  title: "UI/InlineError",
  component: InlineError,
  tags: ["autodocs"],
  args: {
    message: "This is a sample error message.",
  },
} satisfies Meta<typeof InlineError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const LongMessage: Story = {
  args: {
    message:
      "This is a longer error message to showcase wrapping behavior for inline error components in the layout.",
  },
};

export const Empty: Story = {
  args: {
    message: null,
  },
};
