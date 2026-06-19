"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatEuros } from "@/lib/format";
import { orderStatusClasses } from "@/lib/order-status";
import { PasswordInput } from "@/components/PasswordInput";
import {
  apiChangeEmail,
  apiChangePassword,
  apiDeleteAccount,
  apiOrders,
  apiUpdateAddress,
  AuthApiError,
  type AuthAddress,
  type AuthOrder,
} from "@/lib/auth";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

const ADDRESS_FIELDS: { key: keyof AuthAddress; label: string; autoComplete: string }[] = [
  { key: "first_name", label: "Vorname", autoComplete: "given-name" },
  { key: "last_name", label: "Nachname", autoComplete: "family-name" },
  { key: "address_1", label: "Straße und Hausnummer", autoComplete: "address-line1" },
  { key: "address_2", label: "Adresszusatz (optional)", autoComplete: "address-line2" },
  { key: "postcode", label: "PLZ", autoComplete: "postal-code" },
  { key: "city", label: "Stadt", autoComplete: "address-level2" },
];

function AddressForm({
  type,
  title,
  initial,
  withPhone,
}: {
  type: "billing" | "shipping";
  title: string;
  initial: AuthAddress;
  withPhone?: boolean;
}) {
  const { setUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    const form = new FormData(e.currentTarget);
    const address: Partial<AuthAddress> = {};
    for (const { key } of ADDRESS_FIELDS) {
      address[key] = String(form.get(key) ?? "");
    }
    address.country = "DE";
    if (withPhone) address.phone = String(form.get("phone") ?? "");
    try {
      const user = await apiUpdateAddress({ [type]: address });
      setUser(user);
      setMessage("Adresse gespeichert.");
    } catch (err) {
      setError(
        err instanceof AuthApiError
          ? err.message
          : "Speichern fehlgeschlagen. Bitte versuchen Sie es erneut.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-describedby={error ? `${type}-error` : undefined}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {ADDRESS_FIELDS.map(({ key, label, autoComplete }) => (
          <div
            key={key}
            className={key === "address_1" || key === "address_2" ? "sm:col-span-2" : ""}
          >
            <label htmlFor={`${type}_${key}`} className={labelClass}>
              {label}
            </label>
            <input
              id={`${type}_${key}`}
              name={key}
              type="text"
              defaultValue={initial[key] ?? ""}
              autoComplete={autoComplete}
              className={inputClass}
            />
          </div>
        ))}
        {withPhone && (
          <div>
            <label htmlFor={`${type}_phone`} className={labelClass}>
              Telefon (optional)
            </label>
            <input
              id={`${type}_phone`}
              name="phone"
              type="tel"
              defaultValue={initial.phone ?? ""}
              autoComplete="tel"
              className={inputClass}
            />
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary-light rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Speichern…" : "Speichern"}
        </button>
        {message && (
          <span className="text-sm text-green-700" role="status">
            {message}
          </span>
        )}
        {error && (
          <span id={`${type}-error`} role="alert" className="text-sm text-red-700">
            {error}
          </span>
        )}
      </div>
    </form>
  );
}

function OrderList() {
  const [orders, setOrders] = useState<AuthOrder[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiOrders()
      .then(setOrders)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <p className="text-sm text-gray-500">Bestellungen konnten nicht geladen werden.</p>;
  }
  if (orders === null) {
    return <p className="text-sm text-gray-500">Bestellungen werden geladen…</p>;
  }
  if (orders.length === 0) {
    return <p className="text-sm text-gray-500">Sie haben noch keine Bestellungen.</p>;
  }

  return (
    <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/konto/bestellungen/${order.id}`}
          className="flex flex-col gap-2 p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">Bestellung #{order.number}</p>
            <p className="mt-0.5 text-sm text-gray-500">
              {order.date ?? ""} · {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${orderStatusClasses(order.status)}`}
            >
              {order.status_label}
            </span>
            <span className="text-primary font-semibold">{formatEuros(order.total)}</span>
            <span className="text-gray-400" aria-hidden>
              →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** Reusable "confirm this action with your password" modal (P2-19 UI). */
function ConfirmPasswordDialog({
  open,
  title,
  description,
  confirmLabel,
  danger = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: (password: string) => Promise<void>;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setError(null);
    setBusy(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await onConfirm(password);
      // On success the parent closes (unmounts) this dialog.
    } catch (err) {
      setError(
        err instanceof AuthApiError
          ? err.message
          : "Die Aktion ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
        onClick={() => {
          if (!busy) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h3 className={`text-lg font-semibold ${danger ? "text-red-800" : "text-gray-900"}`}>
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <form onSubmit={submit} className="mt-4">
          <label htmlFor="confirm_password" className={labelClass}>
            Aktuelles Passwort
          </label>
          <PasswordInput
            id="confirm_password"
            name="confirm_password"
            autoFocus
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          {error && (
            <p className="mt-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={busy || password === ""}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                danger ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary-light"
              }`}
            >
              {busy ? "Bitte warten…" : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SecurityPanel() {
  const { setUser } = useAuth();
  const router = useRouter();

  const [dialog, setDialog] = useState<"password" | "email" | "delete" | null>(null);

  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState<string | null>(null);

  function openPasswordDialog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwMsg(null);
    setPwErr(null);
    if (newPw.length < 8) {
      setPwErr("Das neue Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (newPw !== newPwConfirm) {
      setPwErr("Die neuen Passwörter stimmen nicht überein.");
      return;
    }
    setDialog("password");
  }

  function openEmailDialog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailMsg(null);
    setDialog("email");
  }

  // Props for the shared confirm dialog, by which action is pending.
  const dialogProps =
    dialog === "password"
      ? {
          title: "Passwort ändern",
          description: "Bitte bestätigen Sie die Änderung mit Ihrem aktuellen Passwort.",
          confirmLabel: "Passwort ändern",
          danger: false,
          onConfirm: async (password: string) => {
            const u = await apiChangePassword(password, newPw);
            setUser(u);
            setNewPw("");
            setNewPwConfirm("");
            setPwMsg("Ihr Passwort wurde geändert.");
            setDialog(null);
          },
        }
      : dialog === "email"
        ? {
            title: "E-Mail-Adresse ändern",
            description:
              "Bitte bestätigen Sie die Änderung mit Ihrem aktuellen Passwort. Eine Bestätigung geht an Ihre bisherige Adresse.",
            confirmLabel: "E-Mail ändern",
            danger: false,
            onConfirm: async (password: string) => {
              const u = await apiChangeEmail(newEmail, password);
              setUser(u);
              setNewEmail("");
              setEmailMsg(
                "Ihre E-Mail-Adresse wurde geändert. Eine Bestätigung wurde an Ihre bisherige Adresse gesendet.",
              );
              setDialog(null);
            },
          }
        : {
            title: "Konto endgültig löschen?",
            description:
              "Ihr Konto und Ihre persönlichen Daten werden gelöscht; bereits getätigte Bestellungen bleiben aus steuerrechtlichen Gründen anonymisiert erhalten. Dieser Schritt kann nicht rückgängig gemacht werden.",
            confirmLabel: "Konto löschen",
            danger: true,
            onConfirm: async (password: string) => {
              await apiDeleteAccount(password);
              setUser(null);
              router.replace("/");
            },
          };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Change password */}
        <form
          onSubmit={openPasswordDialog}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900">Passwort ändern</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="new_password" className={labelClass}>
                Neues Passwort
              </label>
              <PasswordInput
                id="new_password"
                name="new_password"
                required
                minLength={8}
                autoComplete="new-password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-500">Mindestens 8 Zeichen.</p>
            </div>
            <div>
              <label htmlFor="new_password_confirm" className={labelClass}>
                Neues Passwort wiederholen
              </label>
              <PasswordInput
                id="new_password_confirm"
                name="new_password_confirm"
                required
                minLength={8}
                autoComplete="new-password"
                value={newPwConfirm}
                onChange={(e) => setNewPwConfirm(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-light rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition"
            >
              Passwort ändern
            </button>
            {pwMsg && (
              <span className="text-sm text-green-700" role="status">
                {pwMsg}
              </span>
            )}
            {pwErr && (
              <span className="text-sm text-red-700" role="alert">
                {pwErr}
              </span>
            )}
          </div>
        </form>

        {/* Change email */}
        <form
          onSubmit={openEmailDialog}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900">E-Mail-Adresse ändern</h3>
          <div className="mt-4">
            <label htmlFor="new_email" className={labelClass}>
              Neue E-Mail-Adresse
            </label>
            <input
              id="new_email"
              name="new_email"
              type="email"
              required
              autoComplete="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-light rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition"
            >
              E-Mail ändern
            </button>
            {emailMsg && (
              <span className="text-sm text-green-700" role="status">
                {emailMsg}
              </span>
            )}
          </div>
        </form>

        {/* Delete account – danger zone (button opens the confirm dialog) */}
        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-red-800">Konto löschen</h3>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Ihr Konto und Ihre persönlichen Daten werden gelöscht. Aus steuerrechtlichen Gründen
            bleiben bereits getätigte Bestellungen in anonymisierter Form erhalten. Dieser Schritt
            kann nicht rückgängig gemacht werden.
          </p>
          <button
            type="button"
            onClick={() => setDialog("delete")}
            className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Konto löschen
          </button>
        </div>
      </div>

      <ConfirmPasswordDialog
        open={dialog !== null}
        title={dialogProps.title}
        description={dialogProps.description}
        confirmLabel={dialogProps.confirmLabel}
        danger={dialogProps.danger}
        onConfirm={dialogProps.onConfirm}
        onClose={() => setDialog(null)}
      />
    </>
  );
}

export function AccountView() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [tab, setTab] = useState<"orders" | "addresses" | "security">("orders");

  if (!user) return null;

  const displayName = user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.email;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mein Konto</h1>
          <p className="mt-1 text-gray-600">
            Angemeldet als <span className="font-medium">{displayName}</span> ({user.email})
          </p>
        </div>
        <button
          type="button"
          disabled={loggingOut}
          onClick={async () => {
            setLoggingOut(true);
            try {
              await logout();
            } finally {
              setLoggingOut(false);
            }
          }}
          className="self-start rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 sm:self-auto"
        >
          {loggingOut ? "Abmelden…" : "Abmelden"}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-surface-alt mt-8 grid max-w-lg grid-cols-3 gap-2 rounded-xl p-1">
        {(
          [
            ["orders", "Bestellungen"],
            ["addresses", "Adressen"],
            ["security", "Sicherheit"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === key ? "text-primary bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <section className="mt-6">
          <OrderList />
        </section>
      )}

      {tab === "addresses" && (
        <section className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <AddressForm type="billing" title="Rechnungsadresse" initial={user.billing} withPhone />
            <AddressForm type="shipping" title="Lieferadresse" initial={user.shipping} />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Wir liefern derzeit ausschließlich innerhalb Deutschlands.
          </p>
        </section>
      )}

      {tab === "security" && (
        <section className="mt-6">
          <SecurityPanel />
        </section>
      )}
    </div>
  );
}
