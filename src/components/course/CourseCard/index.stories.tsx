import type { Meta, StoryObj } from "@storybook/react";
import { CourseCard } from ".";

const meta = {
  title: "Features/CourseCard",
  component: CourseCard,
  argTypes: {
    progress: {
      control: { type: "range", min: 0, max: 100 },
    },
    onClick: {
      table: {
        disable: true,
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    title: "English Grammar: The Complete Guide",
    description:
      "Master English grammar with our comprehensive course covering all tenses, sentence structures, and common mistakes.",
    imageSrc:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop",
    lessonsCount: 42,
    category: "Grammar",
  },
} satisfies Meta<typeof CourseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// (Not Started)
export const Default: Story = {
  args: {
    progress: 0,
  },
};

export const InProgress: Story = {
  args: {
    progress: 45,
    title: "Advanced Vocabulary Builder",
    category: "Vocabulary",
    imageSrc:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop",
  },
};

export const Completed: Story = {
  args: {
    progress: 100,
    title: "Reading Comprehension 101",
    category: "Reading",
    imageSrc:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
  },
};

export const Gallery: Story = {
  argTypes: {
    progress: { table: { disable: true } },
    title: { table: { disable: true } },
    description: { table: { disable: true } },
    imageSrc: { table: { disable: true } },
    lessonsCount: { table: { disable: true } },
    category: { table: { disable: true } },
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-50">
      <CourseCard
        title="English Tenses"
        description="Learn all 12 tenses in English with simple examples and interactive exercises."
        imageSrc="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop"
        lessonsCount={12}
        category="Grammar"
        progress={0}
      />
      <CourseCard
        title="Daily Conversation"
        description="Speak confidently in daily situations. From ordering coffee to making new friends."
        imageSrc="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
        lessonsCount={25}
        category="Speaking"
        progress={60}
      />
      <CourseCard
        title="Business English"
        description="Essential vocabulary and phrases for your career. Email writing and meetings."
        imageSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
        lessonsCount={18}
        category="Business"
        progress={100}
      />
    </div>
  ),
};
