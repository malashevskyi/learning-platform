import { userEvent } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import UpdatePasswordForm from "./";

const meta = {
  title: "Features/Auth/UpdatePasswordForm",
  component: UpdatePasswordForm,
  parameters: { layout: "centered" },
  argTypes: {
    initialShowSuccess: { control: "boolean" },
  },
  args: {
    initialShowSuccess: false,
  },
  decorators: [
    (Story, { args }) => (
      <div key={JSON.stringify(args.initialShowSuccess)}>
        <Story />
      </div>
    ),
  ],
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
    const passwordInput = canvasElement.querySelector("#password");
    if (passwordInput) await userEvent.type(passwordInput, "1");
    await userEvent.click(canvasElement);
  },
};
