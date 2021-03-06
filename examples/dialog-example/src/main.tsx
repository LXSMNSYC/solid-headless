import { render } from 'solid-js/web';
import App from './App';

import './style.css';

function Root() {
  return (
    <div class="bg-gradient-to-r from-sky-400 to-indigo-500 w-screen h-screen flex overflow-hidden">
      <div class="flex flex-col items-center justify-center w-full">
        <App />
      </div>
    </div>
  );
}

const app = document.getElementById('app');

if (app) {
  render(() => <Root />, app);
}
