<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\NavbarItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NavbarItemController extends Controller
{
    public function index()
    {
        $items = NavbarItem::orderBy('order')->get();
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'navbar_section_id' => 'required|exists:navbar_sections,id',
            'label' => 'required|array',
            'treatment_id' => 'nullable|integer',
            'custom_url' => 'nullable|string',
            'order' => 'integer',
            'open_in_new_tab' => 'boolean',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $item = NavbarItem::create($request->all());

        return response()->json(['message' => 'Item created successfully', 'item' => $item]);
    }

    public function update(Request $request, $id)
    {
        $item = NavbarItem::findOrFail($id);
        $item->update($request->all());

        return response()->json(['message' => 'Item updated successfully', 'item' => $item]);
    }

    public function destroy($id)
    {
        $item = NavbarItem::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item deleted successfully']);
    }
}
