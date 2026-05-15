<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ArticleController extends Controller
{
    public function index()
    {
        return $this->success(Article::with('image')->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $fields = ['title', 'category', 'excerpt', 'content', 'author', 'read_time'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'slug' => 'nullable|string|unique:articles',
            'title' => 'nullable|array',
            'category' => 'nullable|array',
            'image_id' => 'nullable|exists:media,id',
            'excerpt' => 'nullable|array',
            'content' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        if (!isset($data['slug']) || is_null($data['slug'])) {
            $data['slug'] = '';
        }

        $article = Article::create($data);
        return $this->success($article, 'Article created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        $fields = ['title', 'category', 'excerpt', 'content', 'author', 'read_time'];
        $data = $this->prepareMultilingualData($request->all(), $fields);

        // Strip non-fillable keys sent by frontend
        unset($data['media_url'], $data['id'], $data['created_at'], $data['updated_at']);
        
        $validator = Validator::make($data, [
            'slug' => 'nullable|string|unique:articles,slug,' . $id,
            'title' => 'nullable|array',
            'category' => 'nullable|array',
            'image_id' => 'nullable|exists:media,id',
            'excerpt' => 'nullable|array',
            'content' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        if (array_key_exists('slug', $request->all()) && (is_null($request->slug) || $request->slug === '')) {
            $data['slug'] = '';
        }

        $article->update($data);
        return $this->success($article, 'Article updated successfully');
    }

    public function destroy($id)
    {
        Article::findOrFail($id)->delete();
        return $this->success(null, 'Article deleted successfully');
    }
}
