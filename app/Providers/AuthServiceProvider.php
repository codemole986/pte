<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use App\Extensions\Auth0UserProvider;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Auth::provider('auth0', function ($app, array $config) {
            return new Auth0UserProvider($app->make('auth0.connection'));
        });
    }
}
