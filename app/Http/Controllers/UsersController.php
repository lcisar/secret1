<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\ProjectsCollection;
use App\Http\Resources\UserResource;
use App\Models\General\Project;
use App\Models\General\User;
use DB;
use Hash;
use Illuminate\Http\Request;
use Response;
use Validator;

class UsersController extends Controller
{

    public function getProjects($userId)
    {
        $projects = User::with('projects')->findOrFail($userId)->Projects;
        return new ProjectsCollection(ProjectResource::collection($projects));
    }

    public function postRegisterWithProject(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'email' => 'required|email|unique:users,email|max:200',
            'firstname' => 'required|min:1|max:50',
            'lastname' => 'required|min:1|max:50',
            'password' => 'required|min:8|max:50',
            'project_name' => 'required|string|min:1|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json(['messages' => $validator->messages()], 400);
        }

        DB::beginTransaction();
        try {
            $newUserData = $request->only('email', 'firstname', 'lastname');
            $newUserData['password'] = Hash::make($request->get('password'));
            $newUser = User::create($newUserData);
            $newProject = Project::create(['name' => $data['project_name']]);
            $newProject->users()->attach($newUser->id);
            DB::commit();
            return new UserResource($newUser);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['messages' => $e->getMessage()], 500);
        }
    }

    public function putSetPassword(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        if(!$request->has('password')) return response()->json(['messages' => ['password' => 'Password is required']], 400);

        $password = $request->only('password');

        $validator = Validator::make($password, [
            'password' => 'required|string|min:8|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json(['messages' => $validator->messages()], 400);
        }

        $user->password = Hash::make($request->get('password'));
        $user->save();

        return response()->json(['messages' => ['password' => 'Password successfully changed.'] ], 200);
    }
}
