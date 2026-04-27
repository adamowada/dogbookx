import { expect, test } from '@playwright/test'

test('loads the DogbookX feed and composer', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()
  await expect(page.getByLabel('Create a post')).toBeVisible()
  await expect(page.getByText('Bean would like the record')).toBeVisible()
})
