import { test, expect } from '@playwright/test'

const makeTitle = (name: string) => `${name}-${Date.now()}`

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173')
})

test('shows the heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'My Notes' })).toBeVisible()
})

test('can create a note', async ({ page }) => {
  const title = makeTitle('E2E Test Note')

  await page.getByPlaceholder('Title').first().fill(title)
  await page.getByPlaceholder('Write your note...').first().fill('Written by Playwright')
  await page.getByRole('button', { name: 'Add Note' }).click()

  await expect(page.getByRole('heading', { name: title })).toBeVisible()
})

test('can delete a note', async ({ page }) => {
  const title = makeTitle('Note to delete')

  // Create
  await page.getByPlaceholder('Title').first().fill(title)
  await page.getByPlaceholder('Write your note...').first().fill('This will be deleted')
  await page.getByRole('button', { name: 'Add Note' }).click()

  const noteCard = page.getByRole('heading', { name: title }).locator('..').locator('..')

  await expect(noteCard).toBeVisible()

  // Delete scoped to card
  await noteCard.getByRole('button', { name: 'Delete' }).click()

  await expect(page.getByRole('heading', { name: title })).not.toBeVisible()
})

test('can search notes', async ({ page }) => {
  const vueTitle = makeTitle('Vue note')
  const laravelTitle = makeTitle('Laravel note')

  // Create Vue note
  await page.getByPlaceholder('Title').first().fill(vueTitle)
  await page.getByPlaceholder('Write your note...').first().fill('About Vue')
  await page.getByRole('button', { name: 'Add Note' }).click()

  await expect(page.getByRole('heading', { name: vueTitle })).toBeVisible()

  // Clear search
  await page.getByPlaceholder('Enter your search terms...').clear()

  // Create Laravel note
  await page.getByPlaceholder('Title').first().fill(laravelTitle)
  await page.getByPlaceholder('Write your note...').first().fill('About Laravel')
  await page.getByRole('button', { name: 'Add Note' }).click()

  await expect(page.getByRole('heading', { name: laravelTitle })).toBeVisible()

  // Search
  await page.getByPlaceholder('Enter your search terms...').fill('Vue')

  await expect(page.getByRole('heading', { name: vueTitle })).toBeVisible()
  await expect(page.getByRole('heading', { name: laravelTitle })).not.toBeVisible()
})