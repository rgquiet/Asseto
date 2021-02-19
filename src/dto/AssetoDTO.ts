import CurrencyDTO from './CurrencyDTO';
import OverviewDTO from './OverviewDTO';

class AssetoDTO {
    private _main:string;
    private _other:CurrencyDTO[];
    private _overview:OverviewDTO[];
    private _total:number;

    constructor() {
        this._main = '$';
        this._other = [];
        this._overview = [];
        this._total = 0;
    }

    init(data:AssetoDTO) {
        this._main = data['_main'];
        this._other = data['_other'];
        this._overview = data['_overview'];
        this._total = data['_total'];
    }

    private findCurrencyBySymbol(symbol:string) {
        if(symbol === this._main) {
            return -2;
        }
        for(let index in this._other) {
            if(this._other[index]['symbol'] === symbol) {
                return Number(index);
            }
        }
        return -1;
    }

    private updateOther() {
        this._overview.forEach((dto:OverviewDTO) => {
            if(this.findCurrencyBySymbol(dto['currency']) === -1) {
                this._other.push(new CurrencyDTO(dto['currency'], 1));
            }
        });
        this.calculateTotal();
    }

    private calculateTotal() {
        if(this._overview.length === 0) {
            this._total = 0;
        } else {
            let total:number = 0;
            this._overview.forEach((dto:OverviewDTO, index:number, array:OverviewDTO[]) => {
                const i:number = this.findCurrencyBySymbol(dto['currency']);
                if(i === -2) {
                    total += dto['sum'];
                } else {
                    total += dto['sum'] * this._other[i]['factor'];
                }
                if(index === array.length - 1) {
                    this._total = parseFloat(total.toFixed(2));
                }
            });
        }
    }

    get main():string {
        return this._main;
    }

    get other():CurrencyDTO[] {
        return this._other;
    }

    get overview():OverviewDTO[] {
        return this._overview;
    }

    get total():number {
        return this._total;
    }

    set main(main:string) {
        if(this.findCurrencyBySymbol(main) >= 0) {
            this._other = [];
        }
        this._main = main;
        this.updateOther();
    }

    set overview(overview:OverviewDTO[]) {
        this._overview = overview;
        this.updateOther();
    }

    set other(other:CurrencyDTO[]) {
        this._other = other;
        this.calculateTotal();
    }
}

export default AssetoDTO;
