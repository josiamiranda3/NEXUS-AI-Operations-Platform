import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import {
  Settings,
  User,
  Building2,
  Palette,
  Bell,
  Shield,
  RotateCcw,
  CheckCircle2,
  Key,
  Lock,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    user,
    org,
    preferences,
    updateUserProfile,
    updateOrgSettings,
    updatePreferences,
    resetToDemoData,
    showToast,
  } = useNexus();

  const [activeTab, setActiveTab] = useState<
    'general' | 'profile' | 'organization' | 'appearance' | 'notifications' | 'security'
  >('profile');

  // Form states
  const [profileName, setProfileName] = useState(user.name);
  const [profileTitle, setProfileTitle] = useState(user.title);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileAvatar, setProfileAvatar] = useState(user.avatar);

  const [orgName, setOrgName] = useState(org.name);
  const [orgTier, setOrgTier] = useState(org.tier);
  const [orgSpendLimit, setOrgSpendLimit] = useState(org.monthlySpendLimit);
  const [orgCurrency, setOrgCurrency] = useState(org.defaultCurrency);

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName,
      title: profileTitle,
      email: profileEmail,
      avatar: profileAvatar,
    });
  };

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrgSettings({
      name: orgName,
      tier: orgTier,
      monthlySpendLimit: Number(orgSpendLimit),
      defaultCurrency: orgCurrency,
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
          Organization & System Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure executive profiles, visual appearance, notification channels, and compliance controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <Card className="p-2 md:col-span-1 space-y-1">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'organization', label: 'Organization', icon: Building2 },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Auth', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-[#293449]/60">
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/20 border border-rose-500/20 transition-all"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </Card>

        {/* Tab Content Panel */}
        <div className="md:col-span-3 space-y-6">
          {/* 1. Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader
                title="Personal Information"
                subtitle="Manage your identity across the Nexus platform."
              />
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={profileAvatar}
                      alt={profileName}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500/50"
                    />
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        value={profileAvatar}
                        onChange={(e) => setProfileAvatar(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Title / Position
                      </label>
                      <input
                        type="text"
                        value={profileTitle}
                        onChange={(e) => setProfileTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button variant="primary" size="sm" type="submit">
                      Save Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* 2. Organization Tab */}
          {activeTab === 'organization' && (
            <Card>
              <CardHeader
                title="Organization Workspace"
                subtitle="Configure enterprise subscription, spend controls, and billing parameters."
              />
              <CardContent>
                <form onSubmit={handleSaveOrg} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Subscription Tier
                      </label>
                      <select
                        value={orgTier}
                        onChange={(e) => setOrgTier(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                      >
                        <option value="Enterprise Scale">Enterprise Scale</option>
                        <option value="Pro">Pro</option>
                        <option value="Growth">Growth</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Monthly Spend Guardrail ($ USD)
                      </label>
                      <input
                        type="number"
                        value={orgSpendLimit}
                        onChange={(e) => setOrgSpendLimit(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button variant="primary" size="sm" type="submit">
                      Save Organization
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* 3. Appearance Tab */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader
                title="Visual & UI Theme"
                subtitle="Customize interface lighting, density, and contrast."
              />
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Color Theme Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updatePreferences({ theme: 'dark' })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        preferences.theme === 'dark'
                          ? 'bg-purple-600/20 border-purple-500 text-white'
                          : 'bg-[#101522] border-[#293449] text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-sm font-bold">Dark Slate (Default)</div>
                      <div className="text-xs text-slate-400 mt-1">
                        High contrast deep navy interface with purple accents.
                      </div>
                    </button>

                    <button
                      onClick={() => updatePreferences({ theme: 'light' })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        preferences.theme === 'light'
                          ? 'bg-purple-600/20 border-purple-500 text-white'
                          : 'bg-[#101522] border-[#293449] text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-sm font-bold">Light Crisp</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Clean white backdrop with refined slate borders.
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Interface Density
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updatePreferences({ density: 'comfortable' })}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                        preferences.density === 'comfortable'
                          ? 'bg-purple-600 text-white'
                          : 'bg-[#101522] border-[#293449] text-slate-400'
                      }`}
                    >
                      Comfortable (Default)
                    </button>
                    <button
                      onClick={() => updatePreferences({ density: 'compact' })}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                        preferences.density === 'compact'
                          ? 'bg-purple-600 text-white'
                          : 'bg-[#101522] border-[#293449] text-slate-400'
                      }`}
                    >
                      Compact High Density
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4. Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader
                title="Operational Notification Rules"
                subtitle="Choose which events dispatch alerts and reports."
              />
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#101522] border border-[#293449]">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Email Operations Digest</div>
                    <div className="text-[11px] text-slate-400">
                      Receive daily morning roll-up of critical project blockers.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailAlerts}
                    onChange={(e) => updatePreferences({ emailAlerts: e.target.checked })}
                    className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#101522] border border-[#293449]">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Slack Real-time Webhooks</div>
                    <div className="text-[11px] text-slate-400">
                      Post immediately to #ops-alerts on High Risk project flags.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.slackIntegrations}
                    onChange={(e) => updatePreferences({ slackIntegrations: e.target.checked })}
                    className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#101522] border border-[#293449]">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Auto AI Predictive Insights</div>
                    <div className="text-[11px] text-slate-400">
                      Allow Gemini 3.8 Flash to pre-generate weekly sprint suggestions.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.autoAiInsights}
                    onChange={(e) => updatePreferences({ autoAiInsights: e.target.checked })}
                    className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* 5. Security & Auth Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader
                title="Security & Compliance Posture"
                subtitle="Enterprise SSO, hardware keys, and audit logging."
              />
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                  <div className="font-semibold mb-1 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-purple-400" />
                    SOC2 Type II Continuous Attestation Active
                  </div>
                  All administrative modifications are cryptographically audited with timestamped signatures.
                </div>

                <div className="p-3.5 rounded-xl bg-[#101522] border border-[#293449] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Hardware WebAuthn / FIDO2</div>
                    <div className="text-[11px] text-slate-400">Yubikey 5C NFC registered</div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Enforced
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#101522] border border-[#293449] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">SAML 2.0 Single Sign-On (Okta)</div>
                    <div className="text-[11px] text-slate-400">nexus-tech.okta.com federation</div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#101522] border border-[#293449] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Operational API Token</div>
                    <div className="text-[11px] text-slate-500 font-mono">nx_live_9a7b...82f1</div>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => showToast('New API Token rotated', 'success')}
                  >
                    Roll Token
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        title="Reset Demonstration Data"
        message="This will restore all default 12 initiatives, 32 sprint tasks, team members, and telemetry logs back to original state."
        confirmLabel="Reset All Data"
        onConfirm={resetToDemoData}
      />
    </div>
  );
};
