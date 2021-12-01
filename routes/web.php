<?php
use Illuminate\Support\Facades\Route;
use Faker\Factory as Faker;
use App\Http\Controllers\AuthController;
use \App\Http\Controllers\UsersController;

/* ================== TESTY, SERVIS ATD ================== */
Route::get('/', function(){
    return view('frontend.index');
})->name('index');
/* ======================================================= */


/* === API ROUTES LIST ===================================

POST - /api/v1/auth/login
PUT  - /api/v1/auth/logout

POST - /api/v1/user/register-with-project
PUT  - /api/v1/user/{userId}/set-password
GET  - /api/v1/user/{userId}/projects

=========================================================== */


Route::group(['middleware' => 'forceJsonResponse', 'prefix' => 'api/v1/'],function () {

    Route::post('/auth/login', [AuthController::class, 'postLogin']);
    Route::put('/auth/logout', [AuthController::class, 'putLogout']);

    Route::group(['prefix' => 'user'],function () {
        Route::post('/register-with-project', [UsersController::class, 'postRegisterWithProject']);
        Route::put('/{userId}/set-password', [UsersController::class, 'putSetPassword']);
        Route::get('/{userId}/projects', [UsersController::class, 'getProjects']);
    });

});
