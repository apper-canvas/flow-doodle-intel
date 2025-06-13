import GamePage from '@/components/pages/GamePage';

export const routes = {
  game: {
    id: 'game',
    label: 'Game',
    path: '/',
    icon: 'Gamepad2',
    component: GamePage
  }
};

export const routeArray = Object.values(routes);
export default routes;