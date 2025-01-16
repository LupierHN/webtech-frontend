import { describe, it, expect, vi, beforeAll } from 'vitest';
import { flushPromises, RouterLinkStub, shallowMount } from '@vue/test-utils'
import RegisterView from '@/views/RegisterView.vue'
import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Dashboard },
    { path: '/register', component: RegisterView }
  ]
});
vi.mock('axios');

describe('RegisterView', () => {
  beforeAll(async () => {
  });


  it('should render the registration form', async () => {
    const wrapper = shallowMount(RegisterView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    });
    await flushPromises();
    expect(wrapper.find('form').exists()).toBeTruthy();
  })

  it('should search for the email if something is entered in the email field', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: true });
    const wrapper = shallowMount(RegisterView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    });
    await wrapper.find('#email').setValue('test@test.de')
    await flushPromises();
    expect(axios.get).toHaveBeenCalled();
  })

  it('should search for the username if something is entered in the username field', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: true });
    const wrapper = shallowMount(RegisterView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    });
    await wrapper.find('#username').setValue('test')
    await flushPromises();
    expect(axios.get).toHaveBeenCalled();
  })

  it('should display a warning if the passwords do not match', async () => {
    const wrapper = shallowMount(RegisterView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    });
    await wrapper.find('#password').setValue('password')
    await wrapper.find('#confirm-password').setValue('password2')
    await flushPromises();
    expect(wrapper.text()).toContain('Passwords do not match');
  })

  it('should display a warning if the email is already in use', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: true });
    const wrapper = shallowMount(RegisterView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    });
    await wrapper.find('#email').setValue('test@test.de')
    await flushPromises();
    expect(wrapper.text()).toContain('Email is already taken');
  })

  it('should display a warning if the username is already in use', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: true });
    const wrapper = shallowMount(RegisterView, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    });
    await wrapper.find('#username').setValue('test')
    await flushPromises();
    expect(wrapper.text()).toContain('Username is already taken');
  })

});
