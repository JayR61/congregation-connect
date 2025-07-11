
import React, { useState } from 'react';
import { ChurchResource } from '@/types';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResourceImageGalleryProps {
  resources: ChurchResource[];
}

const ResourceImageGallery: React.FC<ResourceImageGalleryProps> = ({ resources }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<ChurchResource | null>(null);
  
  // Filter resources with images by type
  const filteredResources = resources.filter(resource => 
    resource.imageUrl && (selectedType === 'all' || resource.type === selectedType)
  );
  
  // Get unique resource types
  const resourceTypes = Array.from(new Set(resources.map(r => r.type)));
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Resource Gallery</h2>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {resourceTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredResources.map(resource => (
            <Card 
              key={resource.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedImage(resource)}
            >
              <div className="relative h-48">
                <img 
                  src={resource.imageUrl} 
                  alt={resource.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105" 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <h3 className="text-white font-medium truncate">{resource.name}</h3>
                  <div className="flex mt-1">
                    <Badge variant="outline" className="bg-white/20 text-white text-xs">
                      {resource.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No resource images available for the selected filter.
          </p>
        </div>
      )}
      
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
            <DialogDescription>
              {selectedImage?.type.charAt(0).toUpperCase() + selectedImage?.type.slice(1)} • {selectedImage?.location}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="overflow-hidden rounded-md">
              <img 
                src={selectedImage?.imageUrl} 
                alt={selectedImage?.name} 
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground mt-1">{selectedImage?.description}</p>
            </div>
            
            {selectedImage?.notes && (
              <div className="mt-4">
                <h3 className="font-medium">Notes</h3>
                <p className="text-muted-foreground mt-1">{selectedImage.notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceImageGallery;
