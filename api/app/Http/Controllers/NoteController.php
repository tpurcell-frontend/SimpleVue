<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Note;
use App\Models\Tag;

class NoteController extends Controller
{
    /**
     * Get all notes with their tags.
     */
    public function index(): JsonResponse
    {
        return response()->json(Note::with('tags')->latest()->get());
    }

    /**
     * Create a new note with optional tags.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:50'],
            'body' => ['required', 'string', 'max:500'],
            'tags' => ['sometimes', 'array'],
            'tags.*' => ['string', 'max:30'],
        ]);

        $note = Note::create([
            'title' => $validated['title'],
            'body' => $validated['body'],
        ]);

        if(!empty($validated['tags'])) {
            $tagIds = array_map(function ($name) {
                return Tag::firstOrCreate(['name' => strtolower(trim($name))])->id;
            }, $validated['tags']);
            $note->tags()->sync($tagIds);
        }

        return response()->json($note->load('tags'), 201);
    }

    /**
     * Update a note with optional tags.
     */
    public function update(Request $request, Note $note): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:50'],
            'body' => ['required', 'string', 'max:500'],
            'tags' => ['sometimes', 'array'],
            'tags.*' => ['string', 'max:30'],
        ]);

        $note->update([
            'title' => $validated['title'],
            'body' => $validated['body'],
        ]);

        $tagIds = collect($validated['tags'])->map(function ($name) {
            return Tag::firstOrCreate(['name' => strtolower(trim($name))])->id;
        });
        $note->tags()->sync($tagIds);

        return response()->json($note->load('tags'));
    }

    /**
     * Delete a note.
     */
    public function destroy(Note $note): JsonResponse
    {
        $note->delete();
        
        return response()->json(null, 204);
    }
}
