import type { Meta, StoryObj } from "@storybook/react";
import { RegisterForm } from "./";
import React from "react";
import { fn, userEvent } from "@storybook/test";

const meta = {
  title: "Features/Auth/RegisterForm",
  component: RegisterForm,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onSubmit: { table: { disable: true } },
    formError: { control: "text" },
    isLoading: { control: "boolean" },
  },
  args: {
    isLoading: false,
    formError: "",
    onSubmit: fn(),
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

export const WithFormikError: Story = {
  render: (args) => (
    <div className="w-[420px] p-8 border border-border rounded-[20px]">
      <RegisterForm {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const passwordInput = canvasElement.querySelector("#password");
    const emailInput = canvasElement.querySelector("#email");
    const confirmPasswordInput =
      canvasElement.querySelector("#confirmPassword");

    if (passwordInput) {
      await userEvent.type(passwordInput, "1");
    }

    if (emailInput) {
      await userEvent.type(emailInput, "invalid-email");
    }

    if (confirmPasswordInput) {
      await userEvent.type(confirmPasswordInput, "12");
    }

    await userEvent.click(canvasElement);
  },
};

export const WithInputError: Story = {
  args: {
    isLoading: true,
    formError: "Registration failed. Please try again.",
  },
  render: (args: React.ComponentProps<typeof RegisterForm>) => (
    <div className="w-[400px] p-8 border border-border rounded-[20px]">
      <RegisterForm {...args} />
    </div>
  ),
};
