<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Response;
use Str;
use Validator;

class AuthController extends Controller
{

/*  REQUEST BODY
    {
    "email":"<email>",
    "password":"<password>",
    }
*/
/*  RESPONSE
{
    "data": {
        "user": {
            "token": "T1pDiBlL9ipICDkj9g6ZSGwXC7fnT4YFZdlSRUxHhefsvWcrFt",
            "id": 1,
            "firstname": "Luboš",
            "lastname": "Císař",
            "full_name": "Luboš Císař",
            "email": "lcisar@gmail.com",
            "created_at": "2021-11-30T15:27:42.000000Z",
            "updated_at": "2021-11-30T16:15:25.000000Z"
        }
    }
}
*/
    public function postLogin(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|min:8|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json(['messages' => $validator->messages()], 400);
        }

        if(!Auth::attempt($credentials)){
            return response()->json(['messages' => ['user' => 'Login credentials are invalid.'] ], 400);
        }

        $user = Auth::user();

        // TODO - prace s tokenem ---------------
        $user->generateToken();
        // --------------------------------------

        return new UserResource($user);
    }

    public function putLogout()
    {
        Auth::logout();
        return response()->json(['messages' => ['user' => 'You have successfully logged out.'] ], 200);
    }
}
