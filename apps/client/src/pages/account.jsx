import React, { useState } from 'react';
import { useTranslation } from '../LanguageContext';
import { Page, StatusDot } from '../components/shell';

const AccountDashboard = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [region, setRegion] = useState('US-East');

  return (
    <Page
      active="account"
      title={t('account.title')}
      meta={t('common.systemConfig')}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 card-flat p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center text-[15px] font-bold text-cream" style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(212,163,115,0.12)' }}>
                AR
              </div>
              <div>
                <h3 className="text-[16px] font-bold tracking-tight text-cream">{t('common.userName')}</h3>
                <p className="text-[12px] text-sand mt-0.5">{t('account.role')}</p>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-sage mt-1.5"><StatusDot tone="active" />{t('account.verified')}</p>
              </div>
            </div>
            <button className="btn-quiet !py-1.5">{t('common.editProfile')}</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {[
              [t('account.fullName'), t('common.userName')],
              [t('account.emailAddress'), 'alex.rivero@axiom-logic.io'],
              [t('account.language'), t('account.languageValues')],
              [t('account.timezone'), t('account.timezoneValue')],
            ].map(([label, value]) => (
              <div key={label} className="pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="label-caps !text-[10px]">{label}</p>
                <p className="text-[13px] font-medium mt-1 text-cream">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl p-5 bg-coal" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-smoke">{t('account.securityScore')}</p>
            <p className="text-[32px] font-bold tracking-tight mt-1 text-cream">0<span className="text-[14px] text-smoke font-medium"> / 100</span></p>
            <div className="h-1 rounded-full bg-white/10 mt-3"><div className="h-full w-0 rounded-full bg-sage" /></div>
            <p className="text-[11px] text-smoke mt-3 leading-relaxed">{t('account.securityDesc')}</p>
          </div>
          <div className="card-flat p-4">
            <p className="label-caps !text-[10px] mb-2">{t('account.securityShortcuts')}</p>
            {[t('account.rotateApiKeys'), t('account.auditLogs')].map((l) => (
              <div key={l} className="py-2 text-[13px] font-medium text-cream flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {l}<span className="text-smoke">→</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-flat p-6">
          <h3 className="text-[14px] font-bold tracking-tight text-cream">{t('account.teamTitle')}</h3>
          <p className="text-[11px] text-smoke mt-1">0 engineers active</p>
          <p className="text-[13px] text-sand mt-4">No team members found.</p>
        </div>

        <div className="lg:col-span-2 card-flat p-6">
          <h3 className="text-[14px] font-bold tracking-tight mb-4 text-cream">{t('account.securityAccessTitle')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              [t('account.twoFactorAuth'), t('common.active'), 'active'],
              [t('account.password'), t('account.passwordChanged'), 'idle'],
            ].map(([title, status, tone]) => (
              <div key={title} className="card-flat p-4 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-cream">{title}</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-sand mt-1"><StatusDot tone={tone} />{status}</p>
                </div>
                <button className="text-[11px] font-semibold text-ochre hover:underline">Manage</button>
              </div>
            ))}
          </div>
          <p className="label-caps !text-[10px] mt-5 mb-2">{t('account.activeSessions')}</p>
          <div className="card-flat px-3.5 py-3 text-[12px] text-sand">Current session active</div>
        </div>

        <div className="lg:col-span-3 card-flat p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
            <div>
              <h3 className="text-[16px] font-bold tracking-tight text-cream">{t('account.workspaceEnv')}</h3>
              <p className="text-[12px] text-sand mt-1">{t('account.workspaceEnvDesc')}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-quiet">{t('account.archiveWorkspace')}</button>
              <button className="btn-primary">{t('account.saveChanges')}</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="label-caps !text-[10px] mb-2">{t('account.nodeDist')}</p>
              <p className="text-[12px] text-sand leading-relaxed mb-3">{t('account.nodeDistDesc')}</p>
              <div className="flex flex-wrap gap-1.5">
                {[t('account.usEast'), t('account.euCentral'), t('account.apSoutheast')].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${region === r ? '' : 'text-sand hover:text-cream'}`}
                    style={region === r
                      ? { background: '#84A98C', color: '#1C1917' }
                      : { border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label-caps !text-[10px] mb-2">{t('account.autoScaleThreshold')}</p>
              <p className="text-[12px] text-sand leading-relaxed mb-4">{t('account.autoScaleThresholdDesc')}</p>
              <input type="range" className="w-full accent-[#84A98C]" />
              <div className="flex justify-between mt-1.5 text-[10px] font-medium text-smoke uppercase tracking-wider">
                <span>{t('account.precision')}</span><span>{t('account.throughput')}</span>
              </div>
            </div>
            <div>
              <p className="label-caps !text-[10px] mb-2">{t('account.dataRetention')}</p>
              <p className="text-[12px] text-sand leading-relaxed mb-3">{t('account.dataRetentionDesc')}</p>
              <p className="text-[20px] font-bold tracking-tight text-cream">30 <span className="text-[11px] font-medium text-sand">{t('common.days')}</span></p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-3" style={{ border: '1px solid rgba(201,106,94,0.35)', background: 'rgba(201,106,94,0.06)' }}>
          <div className="flex-1">
            <h4 className="text-[13px] font-bold text-brick">{t('account.dangerZone')}</h4>
            <p className="text-[12px] text-sand mt-0.5">{t('account.dangerZoneDesc')}</p>
          </div>
          <button className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-brick text-coal hover:opacity-90">{t('account.terminate')}</button>
        </div>
      </div>
    </Page>
  );
};

export default AccountDashboard;
