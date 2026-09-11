import { createFileRoute } from '@tanstack/solid-router';
import App from '../components/App';

export const Route = createFileRoute('/')({
  component: App,
});
