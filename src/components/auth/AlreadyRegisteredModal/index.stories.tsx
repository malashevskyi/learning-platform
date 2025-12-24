import type { Meta, StoryObj } from "@storybook/react";
import { AlreadyRegisteredModal } from "./";
import { userEvent, within } from "@storybook/test";
import { useAuthModalStore } from "@/store/auth-modal-store";
import * as RoutesModule from "@/app/shared/constants/routes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(RoutesModule as any).ROUTES.LOGIN =
  "?path=/story/features-auth-alreadyregisteredmodal--default";

const meta = {
  title: "Features/Auth/AlreadyRegisteredModal",
  component: AlreadyRegisteredModal,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  decorators: [
    (Story) => {
      useAuthModalStore.setState({
        activeModal: "alreadyRegistered",
        registeredEmail: "user@example.com",
      });
      return <Story />;
    },
  ],
} satisfies Meta<typeof AlreadyRegisteredModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithForgotPassword: Story = {
  decorators: [
    (Story) => {
      useAuthModalStore.setState({
        activeModal: "alreadyRegistered",
        registeredEmail: "user@example.com",
      });
      return <Story />;
    },
  ],
};

export const ResetPasswordEmailSent: Story = {
  decorators: [
    (Story) => {
      useAuthModalStore.setState({
        activeModal: "alreadyRegistered",
        registeredEmail: "user@example.com",
      });
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const forgotPasswordBtn = canvas.getByTestId("#forgot-password-button");
    if (forgotPasswordBtn) await userEvent.click(forgotPasswordBtn);
  },
};
