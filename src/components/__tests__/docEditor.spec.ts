import { describe, it, expect, vi, beforeAll } from 'vitest';
import { flushPromises, shallowMount } from '@vue/test-utils';
import DocEditorAPI from '@/components/DocEditorAPI.vue';
import axios from 'axios';
import { escapeHtml } from '@/utils';
import type { Document } from '@/model/document';

vi.mock('axios');
vi.mock('@/utils', () => ({
  escapeHtml: vi.fn((str: string) => str),
  unescapeHtml: vi.fn((str: string) => str)
}));

const mockDocument: Document = {
  docId: 1,
  name: 'Test Document',
  content: 'Test Content',
  docDate: '2023-01-01',
  owner: {
    uId: 1,
    username: 'testuser',
    email: 'testuser@example.com',
    firstName: 'Test',
    lastName: 'User'
  }
};

describe('DocEditorAPI', () => {
  beforeAll(async () => {
    vi.mock('axios');
  });

  it('should call saveTitle on title change', async () => {
    const wrapper = shallowMount(DocEditorAPI, {
      global: {
        stubs: {
          froala: true
        }
      },
      props: {
        doc: mockDocument,
        title: 'Test Document'
      }
    });
    await flushPromises();
    wrapper.vm.docTitle = 'Updated Title';
    await wrapper.vm.$nextTick();
    expect(escapeHtml).toHaveBeenCalledWith('Updated Title');
  });
});
