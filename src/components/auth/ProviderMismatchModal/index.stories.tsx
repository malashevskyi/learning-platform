import type { Meta, StoryObj } from "@storybook/react";
import { ProviderMismatchModal } from "./";
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
  argTypes: {},
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

export const Google: Story = {};

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
};
