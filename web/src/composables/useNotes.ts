import { ref, onMounted, computed } from 'vue'

// Types
interface Note {
id: number
title: string
body: string
created_at: Date
tags: Tag[]
}

interface Tag {
id: number
name: string
}

// Limits
const TITLE_LIMIT = 50
const BODY_LIMIT = 500

export const useNotes = () => {
    // Note object & fields
    const notes = ref<Note[]>([])
    const title = ref('')
    const body = ref('')

    // Editing
    const editingId = ref<number | null>(null)
    const editTitle = ref('')
    const editBody = ref('')

    // Tags
    const newTag = ref('')
    const editTag = ref('')
    const newTags = ref<string[]>([])
    const editTags = ref<string[]>([])
    const selectedTag = ref('')

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

    // Search
    const search = ref('')

    const filteredNotes = computed(() => 
        notes.value.filter(note => {
            const matchesSearch =
            note.title.toLowerCase().includes(search.value.toLowerCase()) ||
            note.body.toLowerCase().includes(search.value.toLowerCase())

            const matchesTag = 
            !selectedTag.value || 
            note.tags.some(t => t.name === selectedTag.value)

            return matchesSearch && matchesTag
        })
    )

    // Sort
    const sortBy = ref('newest')

    const sortedNotes = computed(() => {
        const notes = [...filteredNotes.value];

        switch(sortBy.value) {
            case 'oldest':
            return notes.sort(
                (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            case 'az':
            return notes.sort(
                (a, b) => a.title.localeCompare(b.title)
            );
            case 'za':
            return notes.sort(
                (a, b) => b.title.localeCompare(a.title)
            );
            default:
            return notes.sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
        }
    })

    // Tagging
    const addNewTag = () => {
        const tag = newTag.value.trim().toLowerCase()
        if (!tag || newTags.value.includes(tag)) return
        newTags.value.push(tag)
        newTag.value = ''
    }

    const removeNewTag = (tag: string) => {
        newTags.value = newTags.value.filter(t => t !== tag)
    }

    const addEditTag = () => {
        const tag = editTag.value.trim().toLowerCase()
        if (!tag || editTags.value.includes(tag)) return
        editTags.value.push(tag)
        editTag.value = ''
    }

    const removeEditTag = (tag: string) => {
        editTags.value = editTags.value.filter(t => t !== tag)
    }

    const allTags = computed(() => {
        const tags = notes.value.flatMap(note => note.tags)
        return [...new Map(tags.map(t => [t.id, t])).values()]
    })

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
            body: JSON.stringify({ title: title.value, body: body.value, tags: newTags.value })
        })
        title.value = ''
        body.value = ''
        newTags.value = []
        await fetchNotes();
    }

    const startEditing = (note: Note) => {
        editingId.value = note.id
        editTitle.value = note.title 
        editBody.value = note.body
        editTags.value = note.tags.map(t => t.name)
    }

    const cancelEditing = () => {
        editTitle.value = ''
        editBody.value = ''
        editTags.value = []
        editingId.value = null
    }

    const saveNote = async (note: Note) => {
        if(!canSave.value) return;
        await fetch(`/api/notes/${note.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: editTitle.value, body: editBody.value, tags: editTags.value })
        })
        editingId.value = null
        editTags.value = []
        await fetchNotes();
    }

    const deleteNote = async(id: number) => {
        await fetch(`/api/notes/${id}`, { method: 'DELETE' })
        await fetchNotes();
    }
    
    return {
        notes, title, body, editingId, editTitle, editBody,
        search, sortBy, newTag, editTag, newTags, editTags, selectedTag,
        TITLE_LIMIT, BODY_LIMIT,
        titleCount, bodyCount, editTitleCount, editBodyCount,
        canCreate, canSave, filteredNotes, sortedNotes, allTags,
        addNewTag, removeNewTag, addEditTag, removeEditTag,
        fetchNotes, createNote, startEditing, cancelEditing, saveNote, deleteNote,
    }
}