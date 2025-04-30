
// This is a minimal stub to fix export issues

export const createTemplate = () => {
  return {
    name: "Example Template",
    title: "Example Title", // Add required fields
    description: "Example Description",
    type: "Example Type", 
    content: "", // Add required field
    category: "", // Add required field
    tags: [], // Add required field
    duration: 60, // Include duration property
    capacity: 20,
    resources: [{
      name: "Example Resource",
      type: "document", // Use valid type
      quantity: 1,
      unit: "piece",
      cost: 0,
      notes: "",
      status: "allocated"
    }],
    createdById: "user-1"
  };
};

const TemplateManager = () => {
  return (
    <div>Template Manager Component</div>
  );
};

export { TemplateManager };
export default TemplateManager;
