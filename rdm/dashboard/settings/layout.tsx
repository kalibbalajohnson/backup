import RdmSettingsBreadcrumbs from './breadcrumbs';

export default function SettingsLayout({ children }) {
  return (
    <div className="flex flex-col space-y-3">
      <RdmSettingsBreadcrumbs />
      <div>{children}</div>
    </div>
  );
}
