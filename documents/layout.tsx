import DossierBreadcrumbs from './breadcrumbs';

export default function DocumentsLayout({ children }) {
  return (
    <div className="flex flex-col space-y-3">
      <DossierBreadcrumbs />
      <div>{children}</div>
    </div>
  );
}
