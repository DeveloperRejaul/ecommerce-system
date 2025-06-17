/* eslint-disable no-restricted-syntax */

export interface ISpecification {title:string, description:string}

export const specificationToString = (data : ISpecification[]) => {
  let specification = '';

  for (const sp of data) {
    specification += `${sp.title}: ${sp.description}__`;
  }

  return specification;
};

export const stringToSpecification = (str: string):ISpecification[] => {
  const arr = [];
  const arrayOfStr = str.split('__');
  for (const sp of arrayOfStr) {
    const arrayObjString = sp.split(':');
    arr.push({ title: arrayObjString[0], description: arrayObjString[1] });
  }
  return arr;
};
