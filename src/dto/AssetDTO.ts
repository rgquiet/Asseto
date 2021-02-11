class AssetDTO {
    name:string;
    amount:number;
    price:number;
    target:number;

    constructor(name:string, amount:number, price:number, target:number) {
        this.name = name;
        this.amount = amount;
        this.price = price;
        this.target = target;
    }
}

export default AssetDTO;
