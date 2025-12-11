import type { Meta, StoryObj } from "@storybook/react";
import { Button, ButtonProps } from "./button";
import { ArrowRight, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "action3d",
        "navigation",
        "ghost",
        "destructive",
        "secondary",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "auto"],
    },
    label: { control: "text" },
  },
  args: {
    variant: "default",
    size: "default",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "default",
    label: "storybook.button.save_changes",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outline",
    label: "storybook.button.cancel",
  },
};

export const Action3D: Story = {
  args: {
    variant: "action3d",
    label: "storybook.button.check_word",
    size: "auto",
  },
};

export const NavigationLink: Story = {
  args: {
    variant: "navigation",
    label: "storybook.button.learn_to_read",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "default",
    size: "icon",
    label: undefined,
  },
  render: (args) => (
    <Button {...args}>
      <Settings className="w-5 h-5" />
    </Button>
  ),
};

const ButtonWithIconRender = (args: ButtonProps) => {
  const t = useTranslations();
  return (
    <Button {...args}>
      <span>{t("storybook.button.next_step")}</span>
      <ArrowRight className="ml-2 w-4 h-4" />
    </Button>
  );
};

export const WithIcon: Story = {
  args: {
    variant: "default",
    label: undefined,
  },
  render: (args) => <ButtonWithIconRender {...args} />,
};
