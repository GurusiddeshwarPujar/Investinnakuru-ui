'use client';

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

// Function to generate a URL slug from a string
const generateUrlSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-'); // Replace multiple hyphens with a single one
};

export default function AddCategoryForm({
  backendUrl,
  authToken,
  editingCategory,
  setEditingCategory,
  onCategoryAdded,
  onCategoryUpdated,
  onError,
  handleAuthError,
}) {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { isSubmitting, errors } 
  } = useForm({
    defaultValues: { catName: "" }
  });

  // Effect to reset the form when a category is selected for editing
  useEffect(() => {
    if (editingCategory) {
      reset({ catName: editingCategory.CatName });
    } else {
      reset({ catName: "" });
    }
  }, [editingCategory, reset]);

  // Handle adding or updating a category
  const handleFormSubmit = async (data) => {
    try {
      const url = editingCategory 
        ? `${backendUrl}/api/cat/${editingCategory.CatId}`
        : `${backendUrl}/api/cat`;
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "x-auth-token": authToken || "" 
        },
        body: JSON.stringify({ CatName: data.catName, CatURL: generateUrlSlug(data.catName) }),
      });

      if (res.status === 401) {
        handleAuthError();
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || `An unexpected error occurred during ${editingCategory ? 'update' : 'creation'}.`);
      }

      if (editingCategory) {
        onCategoryUpdated();
      } else {
        onCategoryAdded();
      }
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold">{editingCategory ? "Update Category" : "Add New Category"}</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
        <div>
          <label htmlFor="catName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Category Name
          </label>
          <input
            type="text"
            id="catName"
            {...register("catName", { 
              required: "Please enter category name.",
              minLength: {
                value: 3,
                message: "Category Name must be at least 3 characters long."
              },
              maxLength: {
                value: 50,
                message: "Category Name cannot exceed 50 characters."
              }
            })}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {errors.catName && (
            <p className="mt-2 text-sm text-red-600">{errors.catName.message}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto
            bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500
            disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : (editingCategory ? "Update Category" : "Add Category")}
          </button>
          {editingCategory && (
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
