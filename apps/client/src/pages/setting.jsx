import React, { useState, useEffect } from 'react';
import { useTranslation } from '../LanguageContext';
import { api } from '../service/api';
import { Page } from '../components/shell';

const CRED_TYPES = ['httpBasic', 'httpBearer', 'httpHeader', 'mysql', 'smtp', 'whatsapp'];

const PlatformSettings = () => {
  const { lang, setLang, t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'httpBearer', data: '{}' });
  const [error, setError] = useState(null);

  const reload = async () => {
    try {
      setCredentials(await api.getCredentials());
    } catch {
      setCredentials([]);
    }
  };

  useEffect(() => { reload(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    let data = {};
    try {
      data = form.data.trim() ? JSON.parse(form.data) : {};
    } catch {
      setError('Data must be valid JSON');
      return;
    }
    try {
      await api.createCredential({ name: form.name, type: form.type, data });
      setForm({ name: '', type: 'httpBearer', data: '{}' });
      reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    await api.deleteCredential(id);
    reload();
  };

  return (
    <Page
      active="settings"
      title={t('settings.title')}
      meta={t('settings.subtitle')}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      actions={<span className="text-[11px] text-smoke font-mono hidden sm:block">{credentials.length} credentials</span>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        <div className="lg:col-span-2 card-flat p-6">
          <p className="label-caps">{t('settings.localization')}</p>
          <h3 className="text-[16px] font-bold tracking-tight mt-1.5 text-cream">{t('settings.regional')}</h3>
          <p className="text-[13px] text-sand mt-1.5 leading-relaxed">{t('settings.regionalDesc')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div>
              <label className="label-caps block mb-2">{t('settings.langLabel')}</label>
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="field">
                <option value="en">English</option>
                <option value="ar">Arabic (العربية)</option>
              </select>
            </div>
            <div>
              <label className="label-caps block mb-2">{t('settings.timeLabel')}</label>
              <input type="time" className="field" />
            </div>
          </div>
          <div className="mt-5 pt-4 flex justify-end" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button className="btn-primary">{t('settings.saveBtn')}</button>
          </div>
        </div>

        <div className="card-flat p-6">
          <p className="label-caps">{t('settings.privacy')}</p>
          <h3 className="text-[16px] font-bold tracking-tight mt-1.5 text-cream">{t('settings.dataScrubbing')}</h3>
          <p className="text-[13px] text-sand mt-1.5 leading-relaxed">{t('settings.dataScrubbingDesc')}</p>
        </div>
      </div>

      <div className="card-flat overflow-hidden mb-3">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-[14px] font-bold tracking-tight text-cream">Credentials</h3>
          <p className="text-[11px] text-smoke mt-0.5 font-mono">Encrypted at rest — plaintext never leaves the engine</p>
        </div>
        <form onSubmit={handleCreate} className="px-5 py-4 grid grid-cols-1 sm:grid-cols-12 gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <input required placeholder="Name" className="field sm:col-span-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select className="field sm:col-span-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {CRED_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <input placeholder='{ "token": "…" }' className="field sm:col-span-4 font-mono !text-[12px]" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
          <button type="submit" className="btn-primary sm:col-span-2">Add</button>
        </form>
        {error && <p className="px-5 py-2 text-[12px] text-brick">{error}</p>}
        {credentials.length === 0 ? (
          <p className="px-5 py-6 text-center text-[13px] text-sand">No credentials stored.</p>
        ) : (
          credentials.map((credential) => (
            <div key={credential.id} className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-cream truncate">{credential.name}</p>
                <p className="text-[10px] text-smoke font-mono">{credential.type} — {credential.id.slice(0, 8)}</p>
              </div>
              <button onClick={() => handleDelete(credential.id)} className="text-[12px] font-medium text-smoke hover:text-brick">Delete</button>
            </div>
          ))
        )}
      </div>

      <div className="card-flat p-6">
        <h3 className="text-[14px] font-bold tracking-tight text-cream">{t('settings.billingTitle')}</h3>
        <p className="label-caps mt-1">{t('settings.currentPlan')}</p>
        <div className="space-y-5 mt-5">
          <div>
            <div className="flex justify-between text-[11px] font-medium text-sand mb-2">
              <span>{t('settings.workflowExecutions')}</span><span className="font-mono text-cream">0 / 100,000</span>
            </div>
            <div className="h-1 rounded-full bg-white/10"><div className="h-full w-0 rounded-full bg-sage" /></div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-medium text-sand mb-2">
              <span>{t('settings.dataStorage')}</span><span className="font-mono text-cream">0 / 10 GB</span>
            </div>
            <div className="h-1 rounded-full bg-white/10"><div className="h-full w-0 rounded-full bg-ochre" /></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-6">
          <button className="btn-quiet">{t('settings.managePayment')}</button>
          <button className="btn-primary">{t('settings.upgradePlan')}</button>
        </div>
      </div>
    </Page>
  );
};

export default PlatformSettings;
