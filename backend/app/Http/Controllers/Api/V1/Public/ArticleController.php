<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;

class ArticleController extends Controller
{
    public function index()
    {
        return response()->json(
            Article::where('is_active', true)->orderBy('created_at', 'desc')->get()
        );
    }

    public function show($slug)
    {
        $article = Article::where('slug', $slug)->where('is_active', true)->firstOrFail();
        return response()->json($article);
    }
}
