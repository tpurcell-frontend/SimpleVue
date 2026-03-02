<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
// use PHPUnit\Framework\TestCase;
use Tests\TestCase;
use App\Models\Note;
use App\Models\Tag;

class NoteUnitTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic unit test example.
     */
    public function test_note_has_fillable_title_and_body(): void
    {
        $note = new Note(['title' => 'Test', 'body' => 'Body', 'extra' => 'ignored']);
        $this->assertEquals('Test', $note->title);
        $this->assertEquals('Body', $note->body);
        $this->assertNull($note->extra ?? null);
    }

    public function test_note_can_have_tags(): void
    {
        $note = Note::create(['title' => 'Test', 'body' => 'Body']);
        $tag = Tag::create(['name' => 'vue']);

        $note->tags()->attach($tag);

        $this->assertCount(1, $note->tags);
        $this->assertEquals('vue', $note->tags->first()->name);
    }
}
