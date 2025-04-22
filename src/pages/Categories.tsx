
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/LoadingState";
import api from "@/services/api";

interface Category {
  id: string;
  name: string;
}

const Categories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/administrator/categories');
      return response.data.data;
    }
  });

  // Add category mutation
  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await api.post('/category', { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category added successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to add category');
    }
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await api.put(`/category/${id}`, { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to update category');
    }
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/category/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete category');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, name: categoryName });
    } else {
      addMutation.mutate(categoryName);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <LoadingState 
          message="Loading categories" 
          variant="spinner"
          className="py-8"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category: Category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(category.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="py-4">
              <Input
                placeholder="Category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
