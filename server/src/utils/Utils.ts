export class Utils {
  static getPresents (price:number, discount:number) {
    return (discount/price)*100;
  }
}

