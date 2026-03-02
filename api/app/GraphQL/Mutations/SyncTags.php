<?php

namespace App\GraphQL\Mutations;

use App\Models\Note;
use App\Models\Tag;

class SyncTags
{
    public function __invoke($_, array $args): Note
    {
        $note = Note::findOrFail($args['note_id']);

        $tagIds = array_map(function ($name) {
            return Tag::firstOrCreate(['name' => strtolower(trim($name))])->id;
        }, $args['tags']);

        $note->tags()->sync($tagIds);

        return $note->load('tags');
    }
}
