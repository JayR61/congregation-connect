
import React from 'react';
import { Programme, ProgrammeCategory, ProgrammeTag } from '@/types';

export interface CategoryTagManagerProps {
  programmes: Programme[];
  categories: ProgrammeCategory[];
  tags: ProgrammeTag[];
  programmeTags: { programmeId: string; tagId: string }[];
  onAddCategory: (category: Omit<ProgrammeCategory, "id">) => ProgrammeCategory;
  onAddTag: (tag: Omit<ProgrammeTag, "id">) => ProgrammeTag;
  onAssignTag: (programmeId: string, tagId: string) => boolean;
  onRemoveTag: (programmeId: string, tagId: string) => boolean;
}

export const CategoryTagManager = ({
  programmes = [],
  categories = [], 
  tags = [],
  programmeTags = [],
  onAddCategory,
  onAddTag,
  onAssignTag,
  onRemoveTag
}: CategoryTagManagerProps) => {
  return (
    <div>
      <h3>CategoryTagManager Component</h3>
      <p>Categories: {categories.length}</p>
      <p>Tags: {tags.length}</p>
      <p>Programme Tags: {programmeTags.length}</p>
    </div>
  );
};

export default CategoryTagManager;
