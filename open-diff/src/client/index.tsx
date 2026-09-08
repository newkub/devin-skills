import { render } from 'solid-js/web';
import { RouterProvider } from '@tanstack/solid-router';
import { router } from './router';
import 'virtual:uno.css';
import './styles.css';

render(() => <RouterProvider router={router} />, document.getElementById('root')!);
