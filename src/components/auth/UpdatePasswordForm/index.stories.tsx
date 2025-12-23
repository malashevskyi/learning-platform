import { userEvent, within } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import UpdatePasswordForm from "./";

const meta = {
  title: "Features/Auth/UpdatePasswordForm",
  component: UpdatePasswordForm,
  parameters: { layout: "centered" },
  argTypes: {},
} satisfies Meta<typeof UpdatePasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="w-[420px] p-8 border border-border rounded-[20px]">
      <UpdatePasswordForm {...args} />
    </div>
  ),
};
export const ShowSuccess: Story = {
  args: { initialShowSuccess: true },
  render: (args) => (
    <div className="w-[420px] p-8 border border-border rounded-[20px]">
      <UpdatePasswordForm {...args} />
    </div>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <div className="w-[420px] p-8 border border-border rounded-[20px]">
      <UpdatePasswordForm {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const passwordInput = canvas.getByPlaceholderText(/Enter your password/i);

    await userEvent.type(passwordInput, "1");

    await userEvent.click(canvasElement);
  },
};
