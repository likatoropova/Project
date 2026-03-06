<?php

namespace App\Http\Requests\Admin\Exercise;

use App\Http\Requests\ApiFormRequest;

class UpdateExerciseRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role?->name === 'admin';
    }

    public function rules(): array
    {
        return [
            'equipment_id' => 'sometimes|exists:equipments,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'muscle_group' => 'sometimes|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'equipment_id.exists' => 'Указанное оборудование не существует',
            'title.max' => 'Название не может быть длиннее 255 символов',
            'image.image' => 'Файл должен быть изображением',
            'image.mimes' => 'Допустимые форматы: jpeg, png, jpg, gif, webp',
            'image.max' => 'Размер файла не должен превышать 5 МБ',
        ];
    }
}
