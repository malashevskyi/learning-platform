import type { ArgTypes, Meta, StoryObj } from "@storybook/react";
import { LoginForm } from "./";
import { fn, userEvent } from "@storybook/test";

type LoginFormPropsWithCustom = React.ComponentProps<typeof LoginForm> & {
  triggerValidation?: boolean;
};

const argTypes: ArgTypes<LoginFormPropsWithCustom> = {
  onSubmit: { table: { disable: true } },
  formError: { control: "text" },
  showForgotPassword: { control: "boolean" },
  // TODO: consider to add custom trigger button
  // triggerValidation: {
  //   control: "number",
  //   name: "🛠️ Trigger Validation Errors",
  // },
};

const meta: Meta<LoginFormPropsWithCustom> = {
  title: "Features/Auth/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "centered",
  },
  argTypes,
  args: {
    formError: "",
    showForgotPassword: false,
    isLoading: false,
    // TODO: consider to add custom trigger button
    // triggerValidation: false,
  },
  decorators: [
    (Story, { args, canvasElement }) => {
      if (args.showForgotPassword) {
        const emailInput = canvasElement.querySelector("#email");

        if (emailInput) {
          void userEvent.clear(emailInput);
          void userEvent.type(emailInput, "test@gmail.com");
        }
      }

      // TODO: consider to add custom trigger button
      // useEffect(() => {
      //   if (args.triggerValidation && canvasElement) {
      //     const runValidation = async () => {
      //       const emailInput = canvasElement.querySelector("#email");
      //       const passwordInput = canvasElement.querySelector("#password");

      //       // Simulate "dirtying" the form to trigger errors
      //       if (emailInput) await userEvent.type(emailInput, "invalid-email");
      //       if (passwordInput) await userEvent.type(passwordInput, "1");

      //       // Click outside or blur to trigger validation
      //       await userEvent.click(canvasElement);
      //     };
      //     runValidation();
      //   }
      // }, [args.triggerValidation, canvasElement]);

      return <Story />;
    },
  ],
} satisfies Meta<LoginFormPropsWithCustom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: false,
    onSubmit: fn(),
  },
  render: (args) => (
    <div className="w-[400px] p-8 border border-border rounded-[20px]">
      <LoginForm {...args} />
    </div>
  ),
};

export const LoadingState: Story = {
  args: {
    isLoading: true,
    onSubmit: fn(),
  },
  render: (args) => (
    <div className="w-[400px] p-8 border border-border">
      <LoginForm {...args} isLoading={true} />
    </div>
  ),
};

export const WithForgotPassword: Story = {
  args: {
    onSubmit: fn(),
    showForgotPassword: true,
  },
  render: (args) => (
    <div className="w-[400px] p-8 border border-border">
      <LoginForm {...args} />
    </div>
  ),
};

export const WithFormikError: Story = {
  args: {
    onSubmit: fn(),
    showForgotPassword: true,
  },
  render: (args) => (
    <div className="w-[420px] p-8 border border-border">
      <LoginForm {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const passwordInput = canvasElement.querySelector("#password");
    const emailInput = canvasElement.querySelector("#email");

    if (passwordInput) {
      await userEvent.type(passwordInput, "1");
    }

    if (emailInput) {
      await userEvent.type(emailInput, "invalid-email");
    }

    await userEvent.click(canvasElement);
  },
};

export const WithInputError: Story = {
  args: {
    onSubmit: fn(),
    formError: "Login failed. Please try again.",
  },
  render: (args: React.ComponentProps<typeof LoginForm>) => (
    <div className="w-[400px] p-8 border border-border rounded-[20px]">
      <LoginForm {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const passwordInput = canvasElement.querySelector("#password");
    const emailInput = canvasElement.querySelector("#email");

    if (passwordInput) {
      await userEvent.type(passwordInput, "123456");
    }

    if (emailInput) {
      await userEvent.type(emailInput, "test@gmail.com");
    }

    await userEvent.click(canvasElement);
  },
};
