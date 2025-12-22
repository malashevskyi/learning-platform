import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
  ],
  framework: "@storybook/nextjs",
  staticDirs: ["../public"],
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_SUPABASE_URL: "https://dummy.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "dummy-anon-key-for-storybook",
  }),
};
export default config;
