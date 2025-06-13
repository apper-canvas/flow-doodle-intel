import GamePage from '@/components/pages/GamePage';
import MultiplayerPage from '@/components/pages/MultiplayerPage';

export const routes = {
  game: {
    id: 'game',
    label: 'Game',
    path: '/',
    icon: 'Gamepad2',
    component: GamePage
  },
  multiplayer: {
    id: 'multiplayer',
    label: 'Multiplayer',
    path: '/multiplayer',
    icon: 'Users',
    component: MultiplayerPage
  }
};

export const routeArray = Object.values(routes);
export default routes;