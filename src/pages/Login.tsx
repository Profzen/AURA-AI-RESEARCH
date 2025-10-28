// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Page de connexion (simulée)
 * Langue : français
 * Palette : bleu clair / blanc
 *
 * NOTE : les identifiants par défaut sont définis dans DEFAULT_CREDENTIALS (non affichés à l'utilisateur).
 * Les boutons sociaux (GitHub / Google) simulent une connexion et redirigent immédiatement vers "/".
 */

const DEFAULT_CREDENTIALS = { email: "admin@example.com", password: "Password123" };

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readAccounts = () => {
    try {
      const raw = localStorage.getItem("app:accounts") || "[]";
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  const saveAccount = (account: { email: string; password: string; name?: string }) => {
    const accounts = readAccounts();
    accounts.push(account);
    localStorage.setItem("app:accounts", JSON.stringify(accounts));
  };

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    // Accept default credentials (explicit)
    if (email === DEFAULT_CREDENTIALS.email && password === DEFAULT_CREDENTIALS.password) {
      localStorage.setItem("app:auth", "true");
      localStorage.setItem("app:auth_user", JSON.stringify({ email }));
      navigate("/", { replace: true });
      return;
    }

    // check simulated accounts
    const accounts = readAccounts();
    const found = accounts.find((a: any) => a.email === email && a.password === password);
    if (found) {
      localStorage.setItem("app:auth", "true");
      localStorage.setItem("app:auth_user", JSON.stringify({ email: found.email }));
      navigate("/", { replace: true });
      return;
    }

    setError("Identifiants invalides — utilisez les identifiants par défaut ou connectez-vous via GitHub/Google.");
  };

  const simulateSocialLogin = (provider: "github" | "google") => {
    const fakeEmail = `${provider}_user@example.com`;
    localStorage.setItem("app:auth", "true");
    localStorage.setItem("app:auth_user", JSON.stringify({ email: fakeEmail, provider }));
    navigate("/", { replace: true });
  };

  const handleCreateAccount = (name: string, em: string, pw: string) => {
    if (!em || !pw) return alert("Email et mot de passe requis");
    saveAccount({ name, email: em, password: pw });
    localStorage.setItem("app:auth", "true");
    localStorage.setItem("app:auth_user", JSON.stringify({ email: em, name }));
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md overflow-hidden md:flex">
        {/* colonne gauche: branding (visible sur md+) */}
        <div className="hidden md:flex md:flex-col md:justify-between md:w-1/2 p-8 bg-sky-50">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">A</div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">AURA Research AI</h1>
                <p className="text-sm text-slate-600">Assistant intelligent pour travaux scientifiques</p>
              </div>
            </div>

            <div className="mt-6 text-sm text-slate-700">
              <p>
                Connexion de démonstration — les boutons « Continuer avec » simulent une authentification et redirigent immédiatement.
                Utilisez les identifiants par défaut côté code pour vous connecter avec le formulaire (non affichés ici).
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs text-slate-500 mb-3">Actions rapides</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEmail(DEFAULT_CREDENTIALS.email);
                  setPassword(DEFAULT_CREDENTIALS.password);
                }}
                className="flex-1 py-2 rounded bg-white border text-sky-700 font-medium"
              >
                Préremplir (démo)
              </button>
              <button onClick={() => simulateSocialLogin("github")} className="py-2 px-3 rounded bg-sky-600 text-white font-medium">
                Démo GitHub
              </button>
            </div>
          </div>
        </div>

        {/* colonne droite : formulaire */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Bienvenue</h2>
          <p className="text-sm text-slate-600 mt-1">Connectez-vous pour accéder à votre espace AI.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs text-slate-600">Adresse e-mail</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@domaine.com"
                className="mt-2 w-full p-3 border rounded-md bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full p-3 border rounded-md bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            {error && <div className="text-sm text-rose-600">{error}</div>}

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button type="submit" className="flex-1 py-3 rounded-md bg-sky-600 text-white font-medium">
                Se connecter
              </button>

              <button
                type="button"
                onClick={() => simulateSocialLogin("github")}
                className="flex items-center justify-center gap-2 py-3 rounded-md border text-sm"
                aria-label="Se connecter avec GitHub"
              >
                {/* GitHub SVG (plus fidèle) */}
                <svg width="18" height="18" viewBox="0 0 24 24" className="inline-block" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
                  <path fill="currentColor" d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.468-2.381 1.235-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.241 2.873.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.807 5.625-5.479 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.289 0 .32.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                Continuer avec GitHub
              </button>
            </div>

            <div className="text-center text-sm text-slate-500 my-2">OU</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => simulateSocialLogin("github")}
                className="py-2 px-3 rounded-md border flex items-center justify-center gap-2"
                aria-label="Se connecter avec GitHub (petit)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="inline-block" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
                  <path fill="currentColor" d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.468-2.381 1.235-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.241 2.873.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.807 5.625-5.479 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.289 0 .32.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </button>

              <button
                type="button"
                onClick={() => simulateSocialLogin("google")}
                className="py-2 px-3 rounded-md border flex items-center justify-center gap-2"
                aria-label="Se connecter avec Google"
              >
                {/* Google multi-color icon */}
                <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
                  <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.5-37.2-4.7-55.4H272v104.9h146.9c-6.3 34.2-25.6 63.2-54.6 82.6v68.6h88.2c51.6-47.4 80-117.8 80-200.7z"/>
                  <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.4 180.7-66.3l-88.2-68.6c-24.6 16.6-56.3 26.3-92.5 26.3-71 0-131.2-47.9-152.7-112.1H30.6v70.6C75.9 492 168.2 544.3 272 544.3z"/>
                  <path fill="#FBBC05" d="M119.3 323.6c-8.2-24.6-8.2-51 0-75.6V177.4H30.6c-38.7 76.6-38.7 167.3 0 243.9l88.7-70z"/>
                  <path fill="#EA4335" d="M272 107.7c39.8 0 75.6 13.7 103.8 40.7l77.8-77.8C405.9 24.6 344 0 272 0 168.2 0 75.9 52.3 30.6 131.6l88.7 70C140.8 155.6 201 107.7 272 107.7z"/>
                </svg>
                Google
              </button>
            </div>

            <div className="mt-6 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <div>Pas de compte ?</div>
                <button type="button" onClick={() => setCreating((s) => !s)} className="text-sky-600 font-medium">
                  Créer un compte
                </button>
              </div>
            </div>
          </form>

          {creating && <CreateAccount onCreate={handleCreateAccount} onClose={() => setCreating(false)} />}
        </div>
      </div>
    </div>
  );
}

/** Création de compte (en ligne, simulation) */
function CreateAccount({ onCreate, onClose }: { onCreate: (name: string, email: string, pw: string) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");

  return (
    <div className="mt-4 border-t pt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="p-2 border rounded" placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="p-2 border rounded" placeholder="Email" value={em} onChange={(e) => setEm(e.target.value)} />
        <input className="p-2 border rounded" placeholder="Mot de passe" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
      </div>

      <div className="flex gap-2 mt-3">
        <button
          className="py-2 px-4 bg-sky-600 text-white rounded"
          onClick={() => {
            onCreate(name, em, pw);
            onClose();
          }}
        >
          Créer et se connecter
        </button>
        <button className="py-2 px-4 border rounded" onClick={onClose}>
          Annuler
        </button>
      </div>
    </div>
  );
}
