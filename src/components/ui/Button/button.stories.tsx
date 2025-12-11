import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  ArrowRight,
  Settings,
  Plus,
  Copy,
  Save,
  Trash2,
  Pause,
  Play,
  Pencil,
  Volume2,
  X,
  ExternalLink,
  Check,
  Headphones,
  Languages,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  UserPen,
  Download,
  Upload,
  RotateCw,
  RefreshCw,
  CircleMinus,
  LogOut,
  LogIn,
} from "lucide-react";
import { BsStars } from "react-icons/bs";

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
    asChild: {
      table: {
        disable: true,
      },
    },
    label: { control: "text" },
    icon: {
      control: "radio",
      options: [
        "None",
        "ArrowRight",
        "Settings",
        "Plus",
        "Copy",
        "Save",
        "Trash",
        "Pause",
        "Play",
        "Pencil",
        "Volume2",
        "X",
        "ExternalLink",
        "Check",
        "Gemini",
        "Translate",
        "Headphones",
        "User",
        "UserPlus",
        "UserMinus",
        "UserCheck",
        "UserPen",
        "Download",
        "Upload",
        "RotateCw",
        "RefreshCw",
        "CircleMinus",
      ],
      mapping: {
        None: null,
        ArrowRight: <ArrowRight />,
        Settings: <Settings />,
        Plus: <Plus />,
        Copy: <Copy />,
        Save: <Save />,
        Trash: <Trash2 />,
        Pause: <Pause />,
        Play: <Play />,
        Pencil: <Pencil />,
        Volume2: <Volume2 />,
        X: <X />,
        ExternalLink: <ExternalLink />,
        Check: <Check />,
        Gemini: <BsStars />,
        Translate: <Languages />,
        Headphones: <Headphones />,
        User: <User />,
        UserPlus: <UserPlus />,
        UserMinus: <UserMinus />,
        UserCheck: <UserCheck />,
        UserPen: <UserPen />,
        Download: <Download />,
        Upload: <Upload />,
        RotateCw: <RotateCw />,
        RefreshCw: <RefreshCw />,
        CircleMinus: <CircleMinus />,
      },
    },
  },
  args: {
    variant: "default",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  argTypes: {
    variant: { table: { disable: true } },
    size: { table: { disable: true } },
    label: { table: { disable: true } },
    icon: { table: { disable: true } },
  },
  render: () => (
    <div className="flex flex-wrap gap-4 items-center justify-start">
      <Button
        variant="default"
        label="storybook.button.save_changes"
        icon={<Save />}
      />
      <Button variant="outline" label="storybook.button.cancel" />
      <Button variant="secondary" label="storybook.button.secondary" />
      <Button
        variant="destructive"
        label="storybook.button.open_video"
        icon={<ExternalLink />}
      />

      <Button variant="outline" icon={<Copy />} />
      <Button variant="default" icon={<Volume2 />} />
      <Button variant="default" icon={<Play />} />
      <Button variant="default" icon={<Pause />} />
      <Button variant="destructive" icon={<Trash2 />} />
      <Button variant="secondary" icon={<Plus />} />
      <Button variant="default" icon={<X />} />
      <Button variant="default" icon={<Settings />} />
      <Button variant="outline" icon={<Pencil />} />
      <Button variant="default" icon={<ArrowRight />} />
      <Button variant="default" icon={<ExternalLink />} />
      <Button variant="outline" icon={<Check />} />
      <Button variant="outline" icon={<BsStars />} />
      <Button variant="outline" icon={<Languages />} />
      <Button variant="outline" icon={<Headphones />} />
      <Button variant="outline" icon={<User />} />
      <Button variant="outline" icon={<UserPlus />} />
      <Button variant="destructive" icon={<UserMinus />} />
      <Button variant="outline" icon={<UserCheck />} />
      <Button variant="outline" icon={<UserPen />} />
      <Button variant="outline" icon={<Download />} />
      <Button variant="outline" icon={<Upload />} />
      <Button variant="outline" icon={<RotateCw />} />
      <Button variant="outline" icon={<RefreshCw />} />
      <Button variant="destructive" icon={<CircleMinus />} />
      <Button variant="outline" label="auth.sign_in" icon={<LogIn />} />
      <Button variant="default" label="auth.sign_up" icon={<UserPlus />} />
      <Button variant="outline" label="auth.log_out" icon={<LogOut />} />
      <Button
        variant="action3d"
        size="auto"
        label="storybook.button.check_word"
      />
      <Button variant="action3d" size="auto" label="1" />
      <Button variant="action3d" size="auto" label="2" />
      <Button variant="action3d" size="auto" label="3" />
      <Button variant="action3d" size="auto" label="a" />
      <Button variant="action3d" size="auto" label="b" />
      <Button variant="action3d" size="auto" label="c" />

      <div className="col-span-4 flex gap-2 w-full max-w-md mt-4 border p-4 rounded-xl">
        <Button variant="navigation" label="storybook.button.learn_to_read" />
      </div>
    </div>
  ),
};

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

export const CopyButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <Copy />,
    label: undefined,
  },
};

export const SaveButton: Story = {
  args: {
    variant: "default",
    label: "Save",
    icon: <Save />,
  },
};

export const DeleteButton: Story = {
  args: {
    variant: "destructive",
    size: "icon",
    icon: <Trash2 />,
    label: undefined,
  },
};

export const AddButton: Story = {
  args: {
    variant: "secondary",
    size: "icon",
    icon: <Plus />,
    label: undefined,
  },
};

export const PlayButton: Story = {
  args: {
    variant: "default",
    size: "icon",
    icon: <Play />,
    label: undefined,
  },
};

export const PauseButton: Story = {
  args: {
    variant: "default",
    size: "icon",
    icon: <Pause />,
    label: undefined,
  },
};

export const AudioButton: Story = {
  args: {
    variant: "default",
    size: "icon",
    icon: <Volume2 />,
    label: undefined,
  },
};

export const CloseButton: Story = {
  args: {
    variant: "default",
    size: "icon",
    icon: <X />,
    label: undefined,
  },
};

export const ExternalLinkButton: Story = {
  args: {
    variant: "default",
    label: "storybook.button.open_video",
    icon: <ExternalLink />,
  },
};

export const CheckButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <Check />,
    label: undefined,
  },
};

export const GeminiButton: Story = {
  args: {
    variant: "outline",
    icon: <BsStars />,
    size: "icon",
  },
};

export const TranslateButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <Languages />,
  },
};

export const HeadphonesButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <Headphones />,
  },
};

export const UserButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <User />,
    label: undefined,
  },
};

export const UserPlusButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <UserPlus />,
    label: undefined,
  },
};

export const UserMinusButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <UserMinus />,
    label: undefined,
  },
};

export const UserCheckButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <UserCheck />,
    label: undefined,
  },
};

export const UserPenButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <UserPen />,
    label: undefined,
  },
};

export const DownloadButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <Download />,
    label: undefined,
  },
};

export const UploadButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <Upload />,
    label: undefined,
  },
};

export const RotateCwButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <RotateCw />,
    label: undefined,
  },
};

export const RefreshCwButton: Story = {
  args: {
    variant: "outline",
    size: "icon",
    icon: <RefreshCw />,
    label: undefined,
  },
};

export const CircleMinusButton: Story = {
  args: {
    variant: "destructive",
    size: "icon",
    icon: <CircleMinus />,
    label: undefined,
  },
};

export const SignIn: Story = {
  args: {
    variant: "outline",
    label: "auth.sign_in",
    icon: <LogIn className="text-primary" />,
  },
};

export const SignUp: Story = {
  args: {
    variant: "default",
    label: "auth.sign_up",
    icon: <UserPlus />,
  },
};

export const LogOutButton: Story = {
  args: {
    variant: "outline",
    label: "auth.log_out",
    icon: <LogOut className="text-muted-foreground" />,
  },
};
