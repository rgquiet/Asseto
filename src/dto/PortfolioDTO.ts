import AssetDTO from './AssetDTO';

// @ts-ignore
class PortfolioDTO {
    name:string;
    currency:string;
    cash:number;
    assets:AssetDTO[];

    constructor(name:string) {
        this.name = name
        this.currency = '$';
        this.cash = 0;
        this.assets = [];
    }
}

export default PortfolioDTO;
