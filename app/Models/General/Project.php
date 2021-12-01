<?php
namespace App\Models\General;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Project extends Model {

    protected $table = "projects";
    protected $guarded = ["id"];

    public function Users()
    {
        return $this->belongsToMany(\App\Models\General\User::class,'projects_users','user_id','project_id');
    }

    public static function boot()
    {
        parent::boot();

        self::created(function($model){
            DB::connection()->getPdo()->exec(str_replace("kimesys_1", "kimesys_".$model->id, file_get_contents(storage_path().'/app/scripts/kimesys_project.sql')));
            DB::connection()->getPdo()->exec('USE `kimesys-ng`;');
        });
    }
}
