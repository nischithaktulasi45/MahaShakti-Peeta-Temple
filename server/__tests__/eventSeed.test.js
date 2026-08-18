const test = require('node:test');
const assert = require('node:assert/strict');
const { memoryState, seedDefaultContentIfNeeded } = require('../utils/storage');

test('seedDefaultContentIfNeeded creates the seven temple event records with local event images', async () => {
  memoryState.events.length = 0;

  await seedDefaultContentIfNeeded();

  assert.equal(memoryState.events.length, 7, 'Expected 7 seeded temple events');

  const titles = memoryState.events.map((event) => event.title);
  assert.deepEqual(titles, [
    'Dasoha',
    'Vadya Ghoshi',
    'Tree Plantation',
    'Book Donation',
    'Arogya Shibira',
    'Blood Donation',
    'Sidda Kannina Hani',
  ]);

  const expectedImages = {
    'Sidda Kannina Hani': '/images/events/Sidda.jpeg',
    'Blood Donation': '/images/events/blood.jpg',
    'Arogya Shibira': '/images/events/health.png',
    'Book Donation': '/images/events/book.jpg',
    'Tree Plantation': '/images/events/tree.jpg',
    'Vadya Ghoshi': '/images/events/vadya.jpg',
    'Dasoha': '/images/events/dasoha.avif',
  };

  for (const event of memoryState.events) {
    assert.equal(event.imageUrl, expectedImages[event.title], `Missing or incorrect image path for ${event.title}`);
  }
});
