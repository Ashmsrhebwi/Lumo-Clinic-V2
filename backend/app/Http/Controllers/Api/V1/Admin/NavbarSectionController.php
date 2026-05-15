<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\NavbarSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NavbarSectionController extends Controller
{
    public function index()
    {
        $sections = NavbarSection::orderBy('order')->with('items')->get();
        return response()->json($sections);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'label' => 'required|array',
            'order' => 'integer',
            'is_footer' => 'boolean',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $section = NavbarSection::create($request->all());

        return response()->json(['message' => 'Section created successfully', 'section' => $section]);
    }

    public function update(Request $request, $id)
    {
        $section = NavbarSection::findOrFail($id);
        $section->update($request->all());

        return response()->json(['message' => 'Section updated successfully', 'section' => $section]);
    }

    public function destroy($id)
    {
        $section = NavbarSection::findOrFail($id);
        $section->delete();

        return response()->json(['message' => 'Section deleted successfully']);
    }

    public function sync(Request $request)
    {
        // Frontend sends the entire navLinks array
        $validator = Validator::make($request->all(), [
            'links' => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Simplistic sync for Phase 1: Update existing sections and items
        foreach ($request->links as $index => $sectionData) {
            $section = NavbarSection::updateOrCreate(
                ['id' => $sectionData['id'] ?? null],
                [
                    'label' => $sectionData['label'],
                    'order' => $index,
                    'is_active' => true
                ]
            );

            if (isset($sectionData['items']) && is_array($sectionData['items'])) {
                foreach ($sectionData['items'] as $itemIndex => $itemData) {
                    \App\Models\NavbarItem::updateOrCreate(
                        ['id' => $itemData['id'] ?? null],
                        [
                            'navbar_section_id' => $section->id,
                            'label' => $itemData['label'],
                            'custom_url' => $itemData['path'],
                            'order' => $itemIndex,
                            'is_active' => true
                        ]
                    );
                }
            }
        }

        return response()->json(['message' => 'Navigation synchronized successfully']);
    }
}
