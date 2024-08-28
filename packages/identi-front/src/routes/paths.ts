// routes
// import { PATH_DASHBOARD } from '../../routes/paths';
export function getPaths(_enable_panels: boolean, _name_panel: string): any[] {
  const sidebarConfig = [
    {
      subheader: '',
      items: [
        {
          title: 'Dashboard',
          path: '/dashboard',
          icon: 'home'
        },
        {
          title: 'Configuración',
          path: '/configuration',
          icon: 'engineering'
        }
      ]
    }
  ];
  return sidebarConfig;
}
// export default sidebarConfig;
