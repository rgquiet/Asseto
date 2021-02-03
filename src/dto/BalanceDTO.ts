// @ts-ignore
class BalanceDTO {
    asset:string;
    amount:number;
    price:number;

    constructor(asset:string, amount:number, price:number) {
        this.asset = asset;
        this.amount =amount;
        this.price = price;
    }
}

export default BalanceDTO;
