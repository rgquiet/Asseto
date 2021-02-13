class OverviewDTO {
    name:string;
    currency:string;
    sum:number;

    constructor(name:string, currency:string, sum:number) {
        this.name = name;
        this.currency = currency;
        this.sum = sum;
    }
}

export default OverviewDTO;
