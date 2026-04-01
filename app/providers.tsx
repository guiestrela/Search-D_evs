"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import i18n from "@/lib/i18n";
import { defaultNS } from "@/lib/i18n";
import { I18nextProvider } from "react-i18next";
import { LanguageSwitcher } from "@/components/language-switcher";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <CacheProvider>
      <I18nextProvider i18n={i18n} defaultNS={defaultNS}>
        <div className="language-switcher-floating">
          <LanguageSwitcher />
        </div>
        <ChakraProvider>{children}</ChakraProvider>
      </I18nextProvider>
    </CacheProvider>
  );
}