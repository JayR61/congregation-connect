
import React, { useState } from 'react';
import { ChurchResource, ResourceCategory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/lib/toast';
import { Folder, Plus, Edit, Trash2, Tag } from 'lucide-react';

interface ResourceCategoryManagerProps {
  resources: ChurchResource[];
  categories: ResourceCategory[];
  onAddCategory?: (category: Omit<ResourceCategory, 'id'>) => void;
  onEditCategory?: (id: string, category: Partial<ResourceCategory>) => void;
  onDeleteCategory?: (id: string) => void;
  onAssignCategory?: (resourceId: string, categoryId: string) => void;
}

const ResourceCategoryManager: React.FC<ResourceCategoryManagerProps> = ({
  resources,
  categories,
  onAddCategory = () => {},
  onEditCategory = () => {},
  onDeleteCategory = () => {},
  onAssignCategory = () => {}
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: '#10b981' // Default color
  });
  
  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!categoryForm.name) {
      toast.error('Category name is required');
      return;
    }
    
    if (editingCategoryId) {
      // Edit existing category
      onEditCategory(editingCategoryId, categoryForm);
      toast.success('Category updated successfully');
    } else {
      // Add new category
      onAddCategory(categoryForm);
      toast.success('Category added successfully');
    }
    
    resetForm();
    setIsDialogOpen(false);
  };
  
  // Open edit dialog
  const handleEdit = (category: ResourceCategory) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      color: category.color || '#10b981'
    });
    setIsDialogOpen(true);
  };
  
  // Handle delete
  const handleDelete = (id: string) => {
    if (resources.some(r => r.category === id)) {
      toast.error('Cannot delete category that is assigned to resources');
      return;
    }
    
    onDeleteCategory(id);
    toast.success('Category deleted successfully');
  };
  
  // Reset form
  const resetForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      color: '#10b981'
    });
    setEditingCategoryId(null);
  };
  
  // Get resources by category
  const getResourcesByCategory = (categoryName: string) => {
    return resources.filter(r => r.category?.toLowerCase() === categoryName.toLowerCase());
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Resource Categories</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage resource categories and assignments
          </p>
        </div>
        <Folder className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Categories</h3>
            <Button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Category
            </Button>
          </div>
          
          {categories.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Resources</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map(category => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: category.color || '#10b981' }}
                        />
                        {category.name}
                      </TableCell>
                      <TableCell>{category.color}</TableCell>
                      <TableCell>{category.description || '-'}</TableCell>
                      <TableCell>{getResourcesByCategory(category.name).length}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 border rounded-md">
              <p className="text-muted-foreground mb-2">No categories defined yet</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add First Category
              </Button>
            </div>
          )}
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Resources by Category</h3>
            
            {categories.map(category => {
              const categoryResources = getResourcesByCategory(category.name);
              
              return (
                <div key={category.id} className="mb-4">
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: category.color || '#10b981' }}
                    />
                    <h4 className="font-medium">{category.name}</h4>
                    <span className="text-xs text-muted-foreground ml-2">({categoryResources.length})</span>
                  </div>
                  
                  {categoryResources.length > 0 ? (
                    <div className="ml-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {categoryResources.map(resource => (
                        <div key={resource.id} className="text-sm border rounded-md p-2">
                          {resource.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="ml-5 text-sm text-muted-foreground">No resources in this category</p>
                  )}
                </div>
              );
            })}
            
            {categories.length === 0 && (
              <p className="text-center text-muted-foreground">
                Add categories first to organize your resources
              </p>
            )}
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategoryId ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={categoryForm.name}
                  onChange={handleFormChange}
                  placeholder="Category name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description"
                  name="description"
                  value={categoryForm.description}
                  onChange={handleFormChange}
                  placeholder="Optional description"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="color"
                    name="color"
                    type="text"
                    value={categoryForm.color}
                    onChange={handleFormChange}
                    placeholder="#RRGGBB"
                  />
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: categoryForm.color }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingCategoryId ? 'Save Changes' : 'Add Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ResourceCategoryManager;
