import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { toast } from "sonner";

type UserSettings = {
  name: string;
  language: string;
  profile: string;
};

interface SettingsPanelProps {
  onClose?: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("fr");
  const [profile, setProfile] = useState("researcher");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userSettings");
      if (raw) {
        const parsed: Partial<UserSettings> = JSON.parse(raw);
        if (parsed.name) setName(parsed.name);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.profile) setProfile(parsed.profile);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSave = () => {
    const payload: UserSettings = { name, language, profile };
    localStorage.setItem("userSettings", JSON.stringify(payload));
    i18n.changeLanguage(language);
    setTimeout(() => {
      toast.success(t("settings.saved"));
      if (onClose) onClose();
    }, 0);
  };

  const handleLogout = () => {
    // For now, just clear stored settings and notify the user.
    localStorage.removeItem("userSettings");
    setTimeout(() => {
      toast(t("settings.disconnected"));
      if (onClose) onClose();
    }, 0);
  };

  return (
    <div className="p-6">
      <SheetHeader>
        <SheetTitle>{t("settings.title")}</SheetTitle>
        <SheetDescription>{t("settings.description")}</SheetDescription>
      </SheetHeader>

      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("settings.name")}</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("settings.namePlaceholder")} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("settings.language")}</label>
          <Select value={language} onValueChange={(v) => setLanguage(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("settings.profile")}</label>
          <Select value={profile} onValueChange={(v) => setProfile(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(t("settings.profileOptions", { returnObjects: true })).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SheetFooter className="mt-6">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" onClick={handleLogout} className="text-destructive">
            {t("settings.logout")}
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>{t("settings.cancel")}</Button>
            <Button onClick={handleSave}>{t("settings.save")}</Button>
          </div>
        </div>
      </SheetFooter>
    </div>
  );
}
