import type { Meta, StoryObj } from "@storybook/react";
import { RegisterForm } from "./";
import React from "react";
import { fn } from "@storybook/test";

const meta = {
  title: "Features/Auth/RegisterForm",
  component: RegisterForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onSubmit: fn(),
    onSignInClick: fn(),
    isLoading: false,
  },
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof RegisterForm>) => (
    <div className="w-[400px] p-8 border border-border rounded-[20px]">
      <RegisterForm {...args} />
    </div>
  ),
};

export const LoadingState: Story = {
  args: {
    isLoading: true,
  },
  render: (args: React.ComponentProps<typeof RegisterForm>) => (
    <div className="w-[400px] p-8 border border-border rounded-[20px]">
      <RegisterForm {...args} />
    </div>
  ),
};
