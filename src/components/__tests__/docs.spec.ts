import { describe, it, expect, vi, beforeAll } from 'vitest';
import { flushPromises, RouterLinkStub, shallowMount } from '@vue/test-utils'
import Dashboard from '../../views/DashboardView.vue';
import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Dashboard }
  ]
});
vi.mock('axios');
describe('DashboardViewWithRestData', () => {
  beforeAll(async () => {
  });
  vi.mock('axios');

  it('if the list of documents from the backend is empty, the info should be displayed', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] });
    const wrapper = shallowMount(Dashboard, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    });
    await flushPromises();
    expect(wrapper.text()).toContain('No documents found');
  });
});
