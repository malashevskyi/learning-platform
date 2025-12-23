import type { Meta, StoryObj } from "@storybook/react";
import { AlreadyRegisteredModal } from "./";
import { fn } from "@storybook/test";
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
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controls whether the modal is visible",
    },
    email: {
      control: "text",
      description: "Email address shown in the modal",
    },
  },
  args: {
    onClose: fn(),
  },
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

export const Default: Story = {
  args: {
    isOpen: true,
  },
};

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
  args: {
    isOpen: true,
  },
};
