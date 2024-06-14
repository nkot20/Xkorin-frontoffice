import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes} from '@angular/router';
import { AuthConfirmationRequiredComponent } from 'app/modules/auth/confirmation-required/confirmation-required.component';
import {ConfirmEmailComponent} from "./confirm-email.component";
import {inject} from "@angular/core";
import {ProfilService} from "../../../core/profil/profil.service";
import {TranslocoService} from "@ngneat/transloco";
import {catchError, throwError} from "rxjs";
import {AuthService} from "../../../core/auth/auth.service";


const confirmEmailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const token  = route.paramMap.get('token');
    const router = inject(Router);

    return authService.confirmEmail(token).pipe(
        // Error here means the requested category is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        }),
    );

};

export default [
    {
        path     : '',
        component: ConfirmEmailComponent,
        resolve: {
            confirmation: confirmEmailResolver,
        }
    },
] as Routes;
