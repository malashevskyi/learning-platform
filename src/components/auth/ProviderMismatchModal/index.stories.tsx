import type { Meta, StoryObj } from "@storybook/react";
import { ProviderMismatchModal } from "./";
import { fn } from "@storybook/test";
import { useAuthModalStore } from "@/store/auth-modal-store";
import * as RoutesModule from "@/app/shared/constants/routes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(RoutesModule as any).ROUTES.LOGIN =
  "?path=/story/features-auth-providermismatchmodal--email";

const meta = {
  title: "Features/Auth/ProviderMismatchModal",
  component: ProviderMismatchModal,
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
        activeModal: "providerMismatch",
        registeredEmail: "user@example.com",
        providerMismatchType: "google",
      });
      return <Story />;
    },
  ],
} satisfies Meta<typeof ProviderMismatchModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Google: Story = {
  args: {
    isOpen: true,
  },
};

export const Email: Story = {
  decorators: [
    (Story) => {
      useAuthModalStore.setState({
        activeModal: "providerMismatch",
        registeredEmail: "user@example.com",
        providerMismatchType: "email",
      });
      return <Story />;
    },
  ],
  args: {
    isOpen: true,
  },
};

export const NoProviderAuthKey: Story = {
  decorators: [
    (Story) => {
      useAuthModalStore.setState({
        activeModal: "providerMismatch",
        registeredEmail: "user@example.com",
        providerMismatchType: "email",
      });
      return <Story />;
    },
  ],
  args: {
    isOpen: true,
  },
};
