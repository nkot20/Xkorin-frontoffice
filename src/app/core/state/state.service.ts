import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StateService {

    private currentImprintIndexSource = new BehaviorSubject<number>(0);
    private currentVariableIndexSource = new BehaviorSubject<number>(0);
    currentStepperIndex$ = new BehaviorSubject<number>(0);

    currentImprintIndex$ = this.currentImprintIndexSource.asObservable();
    currentVariableIndex$ = this.currentVariableIndexSource.asObservable();

    private data: any[] = []; // Remplir avec les données d'empreintes

    constructor(private router: Router) {

    }

    setData(data: any[]): void {
        this.data = data;
    }

    getData(): any[] {
        return this.data;
    }

    get currentImprintIndexSource$() {
        return this.currentImprintIndexSource;
    }

    get currentVariableIndexSource$() {
        return this.currentVariableIndexSource;
    }

    nextVariable() {
        this.resetStepperIndex();
        let currentVariableIndex = this.currentVariableIndexSource.value;
        let currentImprintIndex = this.currentImprintIndexSource.value;

        if (currentVariableIndex < this.data[currentImprintIndex].variables.length - 1) {
            currentVariableIndex++;

            this.currentVariableIndexSource.next(currentVariableIndex);
        } else {
            this.nextImprint();
        }
    }

    nextImprint() {
        let currentImprintIndex = this.currentImprintIndexSource.value;
        if (currentImprintIndex < this.data.length - 1) {
            currentImprintIndex++;
            this.currentImprintIndexSource.next(currentImprintIndex);
            this.currentVariableIndexSource.next(0);
        }
        if (currentImprintIndex == this.data.length - 1)
            this.router.navigate(['assessment'])
    }

    resetStepperIndex(): void {
        this.currentStepperIndex$.next(0);
    }
}
