import type { Meta, StoryObj } from "@storybook/react";
import { EmailVerificationModal } from "./";
import { fn, userEvent, within } from "@storybook/test";
import { useAuthModalStore } from "@/store/auth-modal-store";
import { supabaseClient } from "@/lib/supabase/client";

const meta = {
  title: "Features/Auth/EmailVerificationModal",
  component: EmailVerificationModal,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
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
export const Default: Story = {};

export const WithLongEmail: Story = {
  decorators: [
    (Story) => {
      useAuthModalStore.setState({
        registeredEmail:
          "very.long.email.address.with.many.dots@subdomain.example.com",
      });
      return <Story />;
    },
  ],
};

export const ResendSuccess: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByTestId("resend-email-button");
    if (btn) await userEvent.click(btn);
    await new Promise((r) => setTimeout(r, 200));
  },
};

export const LoadingResend: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByTestId("resend-email-button");
    supabaseClient.auth.resend = fn(async () => {
      return await new Promise((resolve) => setTimeout(resolve, 5000));
    });
    if (btn) await userEvent.click(btn);
    await new Promise((r) => setTimeout(r, 2500));
  },
};

export const ResendError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByTestId("resend-email-button");
    supabaseClient.auth.resend = fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error("");
    });
    if (btn) await userEvent.click(btn);
    await new Promise((r) => setTimeout(r, 200));
  },
};
