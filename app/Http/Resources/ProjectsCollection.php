<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProjectsCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'projects' => $this->collection->transform(function($row){
                return [
                    'id' => $row->id,
                    'name' => $row->name,
                ];
            }),
        ];
    }
}
