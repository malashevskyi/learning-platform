import type { Meta, StoryObj } from "@storybook/react";
import PasswordExpiredNotification from "./";

const meta = {
  title: "Features/Auth/PasswordExpiredNotification",
  component: PasswordExpiredNotification,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    errorDescription: { control: "text" },
  },
  args: {
    errorDescription: "",
  },
} satisfies Meta<typeof PasswordExpiredNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[420px] p-8 border border-border rounded-[20px]">
      <PasswordExpiredNotification {...args} />
    </div>
  ),
};
