import type { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from "./";
import { fn } from "@storybook/test";

const meta = {
  title: "Features/Auth/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onSubmit: { action: "submitted" },
    onGoogleSignIn: { action: "google sign in clicked" },
    onSignUpClick: { action: "sign up clicked" },
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: false,
    onSubmit: fn(),
    onGoogleSignIn: fn(),
    onSignUpClick: fn(),
  },
  render: (args) => (
    <div className="w-[400px] p-8 border border-border rounded-[20px]">
      <LoginForm {...args} />
    </div>
  ),
};

export const LoadingState: Story = {
  args: {
    isLoading: true,
    onSubmit: fn(),
    onGoogleSignIn: fn(),
    onSignUpClick: fn(),
  },
  render: (args) => (
    <div className="w-[400px] p-8 border border-border">
      <LoginForm {...args} isLoading={true} />
    </div>
  ),
};
