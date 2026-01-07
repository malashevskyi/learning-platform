import type { Meta, StoryObj } from "@storybook/react";
import { OnboardingForm } from "./";
import { fn, userEvent } from "@storybook/test";
import { i18n } from "@/i18n/config";

const meta = {
  title: "Features/Onboarding/OnboardingForm",
  component: OnboardingForm,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onSubmit: {
      table: { disable: true },
    },
    isLoading: {
      control: "boolean",
      description: "Whether the form is in loading state",
    },
    formError: {
      control: "text",
      description: "Error message to display at form level",
    },
    initialValues: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    onSubmit: fn(),
    isLoading: false,
    formError: "",
  },
} satisfies Meta<typeof OnboardingForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[420px] p-8 border border-border rounded-[20px]">
      <OnboardingForm {...args} />
    </div>
  ),
};

export const WithInitialValues: Story = {
  args: {
    initialValues: {
      full_name: "John Doe",
      native_language: "uk",
    },
  },
  render: (args) => (
    <div className="w-[420px] p-8 border border-border rounded-[20px]">
      <OnboardingForm {...args} />
    </div>
  ),
};

export const LoadingState: Story = {
  args: {
    isLoading: true,
    initialValues: {
      full_name: "John Doe",
      native_language: i18n.defaultLocale,
    },
  },
  render: (args) => (
    <div className="w-[420px] p-8 border border-border rounded-[20px]">
      <OnboardingForm {...args} />
    </div>
  ),
};

export const WithFormError: Story = {
  args: {
    formError: "Failed to save profile. Please try again.",
  },
  render: (args) => (
    <div className="w-[420px] p-8 border border-border rounded-[20px]">
      <OnboardingForm {...args} />
    </div>
  ),
};

export const WithValidationError: Story = {
  render: (args) => (
    <div className="w-[420px] p-8 border border-border rounded-[20px]">
      <OnboardingForm {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const fullNameInput =
      canvasElement.querySelector<HTMLInputElement>("#full-name");
    if (!fullNameInput) return;

    // Type less than 3 characters
    await userEvent.type(fullNameInput, "AB");

    const submitButton =
      canvasElement.querySelector<HTMLButtonElement>("#save-profile");
    if (submitButton) await userEvent.click(submitButton);
  },
};
