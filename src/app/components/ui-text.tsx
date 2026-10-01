"use client";
import { useLanguage } from "./language";
import { translateUi } from "@/lib/ui-copy";
export function UI({ text }: { text: string }) { const { locale } = useLanguage(); return <>{translateUi(text, locale)}</>; }
