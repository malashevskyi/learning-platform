import type { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from "./";
import { fn, userEvent } from "@storybook/test";

const meta = {
  title: "Features/Auth/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onSubmit: { action: "submitted" },
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: false,
    onSubmit: fn(),
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
  },
  render: (args) => (
    <div className="w-[400px] p-8 border border-border">
      <LoginForm {...args} isLoading={true} />
    </div>
  ),
};

export const WithForgotPassword: Story = {
  args: {
    onSubmit: fn(),
    showForgotPassword: true,
  },
  render: (args) => (
    <div className="w-[400px] p-8 border border-border">
      <LoginForm {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const emailInput = canvasElement.querySelector("#email");
    if (emailInput) {
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, "test@example.com");
    }
    // give Formik a moment to update
    await new Promise((r) => setTimeout(r, 50));
  },
};
