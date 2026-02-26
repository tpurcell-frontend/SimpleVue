<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  interface Note {
    id: number
    title: string
    body: string
  }

  const notes = ref<Note[]>([])
  const title = ref('')
  const body = ref('')

  const fetchNotes = async () => {
    const res = await fetch('/api/notes')
    notes.value = await res.json()
  }

  const createNote = async () => {
    if(!title.value.trim() || !body.value.trim()) return
    await fetch('api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.value, body: body.value })
    })
    title.value = ''
    body.value = ''
    await fetchNotes();
  }

  const deleteNote = async(id: number) => {
    await fetch(`api/notes/${id}`, { method: 'DELETE' })
    await fetchNotes();
  }

  onMounted(() => fetchNotes())
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">My Notes</h1>

    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-lg font-semibold mb-4">New Note</h2>
      <input
        v-model="title"
        type="text"
        placeholder="Title"
        class="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        v-model="body"
        placeholder="Write your note..."
        rows="4"
        class="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
      <button
        @click="createNote"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Add Note
      </button>
    </div>

    <div class="space-y-4">
      <p v-if="notes.length === 0" class="text-gray-400 text-center py-8">
        No notes yet. Add one above.
      </p>
      <div
        v-for="note in notes"
        :key="note.id"
        class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex justify-between items-start">
          <h3 class="font-semibold text-lg">{{ note.title }}</h3>
          <button
            @click="deleteNote(note.id)"
            class="text-red-400 hover:text-red-600 text-sm ml-4"
          >
            Delete
          </button>
        </div>
        <p class="text-gray-600 mt-2">{{ note.body }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
