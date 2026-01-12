<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();
        
        // Check if there's a return URL parameter (highest priority)
        $returnUrl = $request->input('return');
        if ($returnUrl) {
            return redirect($returnUrl);
        }
        
        // Check if there's an intended URL in session
        $intended = $request->session()->pull('url.intended');
        if ($intended) {
            // Only redirect to intended URL if user has access (not admin routes for regular users)
            if ($user->isAdmin() || !str_starts_with($intended, '/admin')) {
                return redirect($intended);
            }
        }
        
        // Default redirect based on user role
        if ($user->isAdmin()) {
            return redirect()->route('dashboard');
        }
        
        // Regular users go to home page
        return redirect()->route('home');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
