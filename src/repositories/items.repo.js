export const createItemRepository = (initialItems = []) => {
  let items = [...initialItems];

  return {
    findAll: async () => items,
    create: async (newItem) => {
      items.push(newItem);
      return newItem;
    },
    findById: async (id) => items.find(item => item.id === parseInt(id))
  };
};