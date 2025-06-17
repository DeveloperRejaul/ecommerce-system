export function PaginatedQueryDecorator() {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
  
      
      const [param1, query, option={}] = args; // Extract dynamic filter value and query
      const { limit = 10, page = 0, sortField = 'createdAt', sortOrder = 'DESC'} = query;

      // // Fetch total count and calculate total pages dynamically based on the filter field
      // const whereCondition = filterField ? { [filterField]: filterValue } : {};


      option['where'] = {...option['where']}; 
      option['limit'] = parseInt(limit, 10);
      option['offset'] = parseInt(limit, 10) * parseInt(page, 10);
      option['order'] =  [[sortField, sortOrder.toUpperCase()]];


      const isQueryExists = Object.values(query).length > 0;
      if(!isQueryExists) {
        return originalMethod.apply(this, [...args]);
      };


      // Pass `option` and `total_page` to the original method
      const data = await originalMethod.apply(this, [...args, option]);
      
      const total_doc = await this.model.count(option);
      const total_page = limit > 0 ? Math.ceil(total_doc / limit) : 1;

      return { data, total_page , current_page:parseInt(page, 10)};
    };

  };
}
