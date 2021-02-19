class CurrencyDTO {
    symbol:string;
    factor:number;

    constructor(symbol:string, factor:number) {
        this.symbol = symbol;
        this.factor = factor;
    }
}

export default CurrencyDTO;
