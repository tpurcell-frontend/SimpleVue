<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useNotes } from '@/composables/useNotes'

  const { notes, title, body, editingId, editTitle, editBody,
    search, sortBy, newTag, editTag, newTags, editTags, selectedTag,
    TITLE_LIMIT, BODY_LIMIT,
    titleCount, bodyCount, editTitleCount, editBodyCount,
    canCreate, canSave, filteredNotes, sortedNotes, allTags,
    addNewTag, removeNewTag, addEditTag, removeEditTag,
    fetchNotes, createNote, startEditing, cancelEditing, saveNote, deleteNote, 
  } = useNotes();

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
      <!-- Search -->
      <input 
        v-model="search"
        type="search"
        placeholder="Enter your search terms..."
        class="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <!-- Tag input for new note -->
      <div class="mb-3">
        <div class="flex gap-2 mb-2">
          <input
            v-model="newTag"
            type="text"
            placeholder="Add a tag..."
            @keyup.enter="addNewTag"
            class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="addNewTag"
            type="button"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
          >
            Add Tag
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in newTags"
            :key="tag"
            class="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full flex items-center gap-1"
          >
            {{ tag }}
            <button @click="removeNewTag(tag)" class="hover:text-blue-900">&times;</button>
          </span>
        </div>
      </div>
      <!-- Add new note-->
      <div>
        <button
          @click="createNote"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          :class="!canCreate && 'bg-gray-500'"
          :disabled="!canCreate"
        >
          Add Note
        </button>
      </div>
      <!-- Sort -->
      <select 
        v-model="sortBy"
        class="mt-4"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="az">AZ</option>
        <option value="za">ZA</option>
      </select>
      <div v-if="allTags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <button
          @click="selectedTag = ''"
          class="text-sm px-3 py-1 rounded-full transition-colors"
          :class="selectedTag === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          All
        </button>
        <button
          v-for="tag in allTags"
          :key="tag.id"
          @click="selectedTag = tag.name"
          class="text-sm px-3 py-1 rounded-full transition-colors"
          :class="selectedTag === tag.name ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
        >
          {{ tag.name }}
        </button>
      </div>
      <p v-if="filteredNotes.length === 0 && notes.length > 0" class="text-red-500 text-left py-8">No notes match your search</p>
    </div>

    <p v-if="notes.length === 0" class="text-gray-400 text-center py-8">
      No notes yet. Add one above.
    </p>

    <div class="space-y-4">
      <div
        v-for="note in sortedNotes"
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
          <!-- Tag input for edit -->
          <div class="mb-3">
            <div class="flex gap-2 mb-2">
              <input
                v-model="editTag"
                type="text"
                placeholder="Add a tag..."
                @keyup.enter="addEditTag"
                class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                @click="addEditTag"
                type="button"
                class="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
              >
                Add Tag
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in editTags"
                :key="tag"
                class="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full flex items-center gap-1"
              >
                {{ tag }}
                <button @click="removeEditTag(tag)" class="hover:text-blue-900">&times;</button>
              </span>
            </div>
          </div>
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
          <p class="text-black-600 mt-2">{{ note.body }}</p>
          <div class="flex flex-wrap gap-2 mt-3">
            <span
              v-for="tag in note.tags"
              :key="tag.id"
              class="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
            >
              {{ tag.name }}
            </span>
          </div>
          <p class="text-gray-600 mt-2">{{ new Date(note.created_at).toLocaleString('default', {month: 'long'}) }} {{ new Date(note.created_at).toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
