import type { Meta, StoryObj } from "@storybook/react";
import { EmailVerificationModal } from "./";
import { fn } from "@storybook/test";
import { useAuthModalStore } from "@/store/auth-modal-store";

const meta = {
  title: "Features/Auth/EmailVerificationModal",
  component: EmailVerificationModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controls whether the modal is visible",
    },
    email: {
      control: "text",
      description: "Email address that needs verification",
    },
  },
  args: {
    onClose: fn(),
  },
  decorators: [
    (Story) => {
      useAuthModalStore.setState({
        activeModal: "verification",
        registeredEmail: "user@example.com",
        verificationVariant: "new-registration",
      });
      return <Story />;
    },
  ],
} satisfies Meta<typeof EmailVerificationModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state of the email verification modal.
 */
export const Default: Story = {
  args: {
    isOpen: true,
    email: "user@example.com",
    onResendEmail: fn(async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }),
  },
};

/**
 * Modal with a long email address to test text wrapping.
 */
export const WithLongEmail: Story = {
  args: {
    isOpen: true,
    email: "very.long.email.address.with.many.dots@subdomain.example.com",
    onResendEmail: fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }),
  },
};

/**
 * Modal during resend email loading state.
 * Note: This simulates the loading state, actual loading is shown when clicking resend.
 */
export const LoadingResend: Story = {
  args: {
    isOpen: true,
    email: "user@example.com",
    onResendEmail: fn(async () => {
      // Simulate longer API call to show loading state
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }),
  },
};

/**
 * Successful resend - click the resend button to see success message.
 */
export const ResendSuccess: Story = {
  args: {
    isOpen: true,
    email: "user@example.com",
    onResendEmail: fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Success - message will appear for 3 seconds
    }),
  },
};

/**
 * Failed resend - click the resend button to see error message.
 */
export const ResendError: Story = {
  args: {
    isOpen: true,
    email: "user@example.com",
    onResendEmail: fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error("Failed to send email");
    }),
  },
};

/**
 * Modal without resend functionality.
 */
export const WithoutResend: Story = {
  args: {
    isOpen: true,
    email: "user@example.com",
    onResendEmail: undefined,
  },
};
