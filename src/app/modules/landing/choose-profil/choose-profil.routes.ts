import { Routes } from '@angular/router';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import {ChooseProfilComponent} from "./choose-profil.component";

export default [
    {
        path     : '',
        component: ChooseProfilComponent,
    },
] as Routes;
