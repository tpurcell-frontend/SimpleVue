import { describe, it, expect, beforeEach} from 'vitest';
import { useNotes } from './useNotes';

describe('useNotes', () => {
    describe('character counts', () => {
        it('counts title characters', () => {
            const { title, titleCount } = useNotes()
            title.value = 'Hello'
            expect(titleCount.value).toBe(5)
        })

        it('counts body characters', () => {
            const { body, bodyCount } = useNotes()
            body.value = 'Hello World'
            expect(bodyCount.value).toBe(11)
        })
    })

    describe('canCreate', () => {
    it('is false when fields are empty', () => {
      const { canCreate } = useNotes()
      expect(canCreate.value).toBe(false)
    })

    it('is true when title and body are filled', () => {
      const { title, body, canCreate } = useNotes()
      title.value = 'My note'
      body.value = 'My body'
      expect(canCreate.value).toBe(true)
    })

    it('is false when title exceeds limit', () => {
      const { title, body, canCreate } = useNotes()
      title.value = 'a'.repeat(51)
      body.value = 'My body'
      expect(canCreate.value).toBe(false)
    })

    it('is false when body exceeds limit', () => {
      const { title, body, canCreate } = useNotes()
      title.value = 'My note'
      body.value = 'a'.repeat(501)
      expect(canCreate.value).toBe(false)
    })
  })

  describe('tags', () => {
    it('adds a new tag', () => {
        const { newTag, newTags, addNewTag } = useNotes()
        newTag.value = 'vue'
        addNewTag()
        expect(newTags.value).toContain('vue')
    })

    it('lowercases tags', () => {
        const { newTag, newTags, addNewTag } = useNotes()
        newTag.value = 'Vue'
        addNewTag()
        expect(newTags.value).toContain('vue')
    })

    it('does not add duplicate tags', () => {
        const { newTag, newTags, addNewTag } = useNotes()
        newTag.value = 'vue'
        addNewTag()
        newTag.value = 'vue'
        addNewTag()
        expect(newTags.value).toHaveLength(1)
    })

    it('removes a tag', () => {
        const { newTag, newTags, addNewTag, removeNewTag } = useNotes()
        newTag.value = 'vue'
        addNewTag()
        removeNewTag('vue')
        expect(newTags.value).toHaveLength(0)
        })
    })
})