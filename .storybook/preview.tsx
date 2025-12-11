import type { Preview } from "@storybook/react";
import { NextIntlClientProvider } from "next-intl";
import enAppMessages from "../src/i18n/messages/en.json";
import ukAppMessages from "../src/i18n/messages/uk.json";

import enStorybookMessages from "../src/i18n/messages/storybook/en.json";
import ukStorybookMessages from "../src/i18n/messages/storybook/uk.json";

import "../src/styles/global.css";

const messagesByLocale = {
  en: {
    ...enAppMessages,
    storybook: enStorybookMessages,
  },
  uk: {
    ...ukAppMessages,
    storybook: ukStorybookMessages,
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    locale: {
      description: "Internationalization locale",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "uk", title: "Українська" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <NextIntlClientProvider
        locale={context.globals.locale}
        messages={messagesByLocale[context.globals.locale]}
        onError={(error) => {
          // If a translation key is missing in the current locale messages, this warning is suppressed.
          // This is useful when testing component resizing by passing different text sizes into props.label that do not exist in the translation files.
          if (error.code === "MISSING_MESSAGE") return;

          console.error(error);
        }}
      >
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default preview;
