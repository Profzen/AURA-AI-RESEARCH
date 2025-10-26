import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    toast.success("Paramètres sauvegardés");
    if (onClose) onClose();
  };

  const handleLogout = () => {
    // For now, just clear stored settings and notify the user.
    localStorage.removeItem("userSettings");
    toast("Déconnecté");
    if (onClose) onClose();
  };

  return (
    <div className="p-6">
      <SheetHeader>
        <SheetTitle>Paramètres</SheetTitle>
        <SheetDescription>Personnalisez votre profil et préférences.</SheetDescription>
      </SheetHeader>

      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Langue</label>
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
          <label className="block text-sm font-medium mb-1">Type de profil</label>
          <Select value={profile} onValueChange={(v) => setProfile(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="researcher">Chercheur</SelectItem>
                <SelectItem value="student">Étudiant</SelectItem>
                <SelectItem value="marketer">Marketeur</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="dev">Développeur</SelectItem>
                <SelectItem value="clinician">Clinicien</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SheetFooter className="mt-6">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" onClick={handleLogout} className="text-destructive">
            Se déconnecter
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>
      </SheetFooter>
    </div>
  );
}
