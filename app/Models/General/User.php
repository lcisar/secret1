<?php

namespace App\Models\General;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;


class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $appends = ['fullName'];
    protected $guarded = ['id'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getFullNameAttribute(){
        return $this->firstname.' '.$this->lastname;
    }

    public function Projects()
    {
        return $this->belongsToMany(\App\Models\General\Project::class,'projects_users','user_id','project_id');
    }

    public function generateToken(){
        $this->token = Str::random(50);
        $this->save();
        return $this->token;
    }

}
