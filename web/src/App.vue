<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'

  interface Note {
    id: number
    title: string
    body: string
  }

  const notes = ref<Note[]>([])
  const title = ref('')
  const body = ref('')
  const editingId = ref<number | null>(null)
  const editTitle = ref('')
  const editBody = ref('')

  // Limits
  const TITLE_LIMIT = 50
  const BODY_LIMIT = 500

  // Character counts
  const titleCount = computed(() => title.value.length)
  const bodyCount = computed(() => body.value.length)
  const editTitleCount = computed(() => editTitle.value.length)
  const editBodyCount = computed(() => editBody.value.length)

  // Validation
  const canCreate = computed(() => 
    title.value.trim().length > 0 &&
    body.value.trim().length > 0 &&    
    titleCount.value <= TITLE_LIMIT &&
    bodyCount.value <= BODY_LIMIT
  )

  const canSave = computed(() => 
    editTitle.value.trim().length > 0 &&
    editBody.value.trim().length > 0 &&    
    editTitleCount.value <= TITLE_LIMIT &&
    editBodyCount.value <= BODY_LIMIT
  )

  // Note functions
  const fetchNotes = async () => {
    const res = await fetch('/api/notes')
    notes.value = await res.json()
  }

  const createNote = async () => {
    if(!canCreate.value) return;
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.value, body: body.value })
    })
    title.value = ''
    body.value = ''
    await fetchNotes();
  }

  const startEditing = (note: Note) => {
    editingId.value = note.id
    editTitle.value = note.title 
    editBody.value = note.body
  }

  const cancelEditing = () => {
    editTitle.value = ''
    editBody.value = ''
    editingId.value = null
  }

  const saveNote = async (note: Note) => {
    if(!canSave.value) return;
    await fetch(`/api/notes/${note.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle.value, body: editBody.value })
    })
    editingId.value = null
    await fetchNotes();
  }

  const deleteNote = async(id: number) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' })
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
      <p class="text-right mb-3" :class="titleCount > TITLE_LIMIT ? 'text-red-500' : 'text-gray-500'">{{titleCount}}/50</p>
      <textarea
        v-model="body"
        placeholder="Write your note..."
        rows="4"
        class="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
      <p class="text-right mb-3" :class="bodyCount > BODY_LIMIT ? 'text-red-500' : 'text-gray-500'">{{bodyCount}}/500</p>
      <button
        @click="createNote"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        :class="!canCreate && 'bg-gray-500'"
        :disabled="!canCreate"
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
        <!-- Editing state -->
        <div v-if="editingId === note.id">
          <input
            v-model="editTitle"
            type="text"
            placeholder="Title"
            class="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-right mb-3" :class="editTitleCount > TITLE_LIMIT ? 'text-red-500' : 'text-gray-500'">{{editTitleCount}}/50</p>
          <textarea
              v-model="editBody"
              placeholder="Write your note..."
              rows="4"
              class="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </textarea>
          <p class="text-right mb-3" :class="editBodyCount > BODY_LIMIT ? 'text-red-500' : 'text-gray-500'">{{editBodyCount}}/500</p>
          <button
            @click="saveNote(note)"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            :class="!canSave && 'bg-gray-500'"
            :disabled="!canSave"
          >
            Save
          </button>
          <button
              @click="cancelEditing()"
              class="text-blue-400 hover:text-blue-600 text-sm"
            >
            Cancel
          </button>
        </div>
        <!-- Viewing state -->
        <div v-else>
          <div class="flex flex-wrap justify-between items-start">
            <h3 class="font-semibold text-lg">{{ note.title }}</h3>
            <div>
              <button
                  @click="startEditing(note)"
                  class="text-blue-400 hover:text-blue-600 text-sm"
                >
                Edit
              </button>
              <button
                @click="deleteNote(note.id)"
                class="text-red-400 hover:text-red-600 text-sm ml-4"
              >
                Delete
              </button>
            </div>
          </div>
          <p class="text-gray-600 mt-2">{{ note.body }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
