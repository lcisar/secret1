<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends BaseResource
{

    public function toArray($request)
    {
        return [
            'user'=> [
                'token' => $this->token,
                'id' => $this->id,
                'firstname' => $this->firstname,
                'lastname' => $this->lastname,
                'full_name' => $this->fullName,
                'email' => $this->email,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at
                ]
        ];
    }
}
