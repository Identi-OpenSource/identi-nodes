import { HOST_URL } from '~/config/environment';

export const moduleRoute = {
  dashboard: {
    path: '/dashboard',
    module_name: 'dashboard',
    module_code: 'dc7161be3dbf2250c8954e560cc35060',
    text: 'Home',
    icon: 'home'
  },
  collection: {
    path: '/collection',
    module_name: 'collection',
    module_code: 'dc7161be3dbf2250c8954e560cc35122',
    text: 'Collection',
    icon: 'leaderboard'
  },
  entities: {
    path: '/entities',
    module_name: 'entities',
    module_code: 'dc7161be3dbf2250c8954e560cc32322',
    text: 'Entidades',
    icon: 'fingerprint'
  }
};

export default {
  // -- Endpoint-- //
  login: HOST_URL + '/',
  recoveryPassword: HOST_URL + '/recovery-password',

  //Dashboard
  dashboard: moduleRoute.dashboard.path,
  entities: moduleRoute.entities.path,
  entities_show: moduleRoute.entities.path + '/show'
};
