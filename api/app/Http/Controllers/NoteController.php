<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Note;

class NoteController extends Controller
{
    /**
     * Get all notes.
     */
    public function index(): JsonResponse
    {
        return response()->json(Note::latest()->get());
    }

    /**
     * Create a new note.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        $note = Note::create($validated);

        return response()->json($note, 201);
    }

    /**
     * Update a note.
     */
    public function update(Request $request, Note $note): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        $note->update($validated);

        return response()->json($note);
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
