import AssetDTO from './AssetDTO';

// @ts-ignore
class PortfolioDTO {
    name:string;
    currency:string;
    private _sum:number;
    private _cash:number;
    private _assets:AssetDTO[];

    constructor(name:string) {
        this.name = name
        this.currency = '$';
        this._sum = 0;
        this._cash = 0;
        this._assets = [];
    }

    init(data:PortfolioDTO) {
        this.name = data['name'];
        this.currency = data['currency'];
        //this._sum = data['_sum'];
        this._cash = data['_cash'];
        this.assets = data['_assets'];
    }

    private calculateSum() {
        if(this._assets.length === 0) {
            this._sum = this._cash;
        } else {
            let sum:number = 0;
            this._assets.forEach((asset:AssetDTO, index:number, array:AssetDTO[]) => {
                sum += asset.amount * asset.price;
                if(index === array.length - 1) {
                    sum += this._cash;
                    this._sum = parseFloat(sum.toFixed(2));
                }
            });
        }
    }

    get sum():number {
        return this._sum;
    }

    get cash():number {
        return this._cash;
    }

    get assets():AssetDTO[] {
        return this._assets;
    }

    set cash(cash:number) {
        this._cash = cash;
        this.calculateSum();
    }

    set assets(assets:AssetDTO[]) {
        this._assets = assets;
        this.calculateSum();
    }
}

export default PortfolioDTO;
