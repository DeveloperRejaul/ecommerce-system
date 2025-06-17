import { Op } from 'sequelize';

// Define a reusable decorator
export default function ProductFilterDecorator() {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args) {
            const [categoryId, query, option = { where: {} }] = args;
            const { discount, rating, discounts, brands } = query || {};

            // Handle rating filter
            if (rating) {
                const start = +rating;
                const end = start + 0.9;
                option.where = {
                    ...option.where,
                    rating: { [Op.between]: [start, end] },
                };
            }

            // Handle brands
            if (brands) {
                option.where = {
                    ...option.where,
                    brandId: { [Op.in]: brands.split(',') },
                };
            }

            // // Handle single discount filter
            // if (discount) {
            //     option.where.discount = +discount;
            // }
            // // Handle multiple discounts
            // if (discounts) {
            //     const values: number[] = [];
            //     const discountArray: string[] = discounts.split(',');

            //     discountArray.forEach(discount => {
            //         const start = Number(discount);
            //         const rangeEnd = start + 10;

            //         for (let i = start; i < rangeEnd; i++) {
            //             values.push(i);
            //         }
            //     });
                
            //     option.where = {
            //         ...option.where,
            //         discount: { [Op.in]: values },
            //     };
            // }

            // Call the original method with the modified options
            return originalMethod.apply(this, [categoryId, query, option]);
        };
    };
}
