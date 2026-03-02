<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Note;

class NoteTest extends TestCase
{
    use RefreshDatabase;
    
    /**
     * A basic feature test example.
     */

    public function test_can_get_all_notes(): void
    {
        Note::create(['title' => 'Test Note', 'body' => 'Test body']);

        $response = $this->getJson('api/notes');

        $response->assertStatus(200)
                ->assertJsonCount(1)
                ->assertJsonFragment(['title' => 'Test Note']);
    }

    public function test_can_create_a_note(): void
    {
        $response = $this->postJson('api/notes', [
            'title' => 'Test Note',
            'body' => 'Test body',
        ]);

        $response->assertStatus(201)
                ->assertJsonFragment(['title' => 'Test Note']);

        $this->assertDatabaseHas('notes', ['title' => 'Test Note']);
    }

    public function test_can_create_note_without_title(): void
    {
        $response = $this->postJson('api/notes', [
            'body' => 'Note body',
        ]);

        $response->assertStatus(422)
                ->assertJsonFragment(['title' => ['The title field is required.']]);
    }

    public function test_can_delete_a_note(): void
    {
        $note = Note::create(['title' => 'To Delete', 'body' => 'Body']);
        
        $this->assertDatabaseHas('notes', ['id' => $note->id]);

        $response = $this->deleteJson("/api/notes/{$note->id}");

        $response->assertStatus(204);
    }
}
