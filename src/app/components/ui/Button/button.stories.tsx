import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { ArrowRight, Settings, Plus } from "lucide-react";

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
      options: ["default", "sm", "lg", "auto", "icon"],
    },
    label: { control: "text" },
    icon: {
      control: "radio",
      options: ["None", "ArrowRight", "Settings", "Plus"],
      mapping: {
        None: null,
        ArrowRight: <ArrowRight />,
        Settings: <Settings />,
        Plus: <Plus />,
      },
    },
  },
  args: {
    variant: "default",
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
    icon: <Settings />,
    label: undefined,
  },
};

export const WithIcon: Story = {
  args: {
    variant: "default",
    label: "storybook.button.next_step",
    icon: <ArrowRight />,
  },
};
