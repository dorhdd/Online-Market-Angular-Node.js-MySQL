
export class Product {
    public productId:number;
    public productName:string;
    public categoryId:number;
    public price: number;
    public img: string;


    constructor(productId:number, productName: string, categoryId: number, price:number, img:string){
        this.productId = productId;
        this.productName = productName;
        this.categoryId = categoryId;
        this.price = price;
        this.img = img
    }
}