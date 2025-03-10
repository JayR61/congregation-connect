
import { SettingsTabs } from '@/components/settings/SettingsTabs';

const Settings = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <SettingsTabs />
    </div>
  );
};

export default Settings;
