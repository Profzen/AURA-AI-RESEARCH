export type UserProfile = "researcher" | "marketer" | "student" | "designer" | "dev";

interface ProfileSelectorProps {
  selectedProfile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
}

export function ProfileSelector({ selectedProfile, onProfileChange }: ProfileSelectorProps) {
  return (
    <div className="flex justify-start gap-1.5 sm:gap-2 overflow-x-auto -mx-2 px-2 py-1 no-scrollbar">
      {[
        { id: "researcher", label: "Chercheur" },
        { id: "marketer", label: "Marketeur" },
        { id: "student", label: "Étudiant" },
        { id: "designer", label: "Designer" },
        { id: "dev", label: "Développeur" },
      ].map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onProfileChange(id as UserProfile)}
          className={`px-3 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-colors ${
            selectedProfile === id
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}