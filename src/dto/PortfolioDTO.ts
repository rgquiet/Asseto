import BalanceDTO from './BalanceDTO';

// @ts-ignore
class PortfolioDTO {
    name:string;
    currency:string;
    cash:number;
    balance:BalanceDTO[];

    constructor(name:string) {
        this.name = name
        this.currency = '$';
        this.cash = 0;
        // wip: Array should be empty
        this.balance = [new BalanceDTO('MSCI World', 10, 51.35)];
    }
}

export default PortfolioDTO;
