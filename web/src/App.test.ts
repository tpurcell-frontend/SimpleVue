import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import App from './App.vue'

// Mock fetch so we don't make real API calls
const mockNotes = [
  {
    id: 1,
    title: 'Test Note',
    body: 'Test body',
    created_at: '2026-01-01T00:00:00.000Z',
    tags: [{ id: 1, name: 'vue' }],
  },
]

beforeEach(() => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve(mockNotes),
  })
})

describe('App', () => {
  it('renders the heading', async () => {
    const wrapper = mount(App)
    expect(wrapper.find('h1').text()).toBe('My Notes')
  })

  it('renders notes after fetching', async () => {
    const wrapper = mount(App)
    await flushPromises()
    expect(wrapper.text()).toContain('Test Note')
  })

  it('shows empty message when no notes', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([]),
    })
    const wrapper = mount(App)
    await flushPromises()
    expect(wrapper.text()).toContain('No notes yet')
  })

  it('disables Add Note button when fields are empty', async () => {
    const wrapper = mount(App)
    await flushPromises()
    const buttons = wrapper.findAll('button')
    const addButton = buttons.find(b => b.text() === 'Add Note')
    expect(addButton?.attributes('disabled')).toBeDefined()
  })
})